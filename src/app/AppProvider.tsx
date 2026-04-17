import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import {
  announcementsSeed,
  apiKeysSeed,
  financeTransactionsSeed,
  importJobsSeed,
  ordersSeed,
  payoutsSeed,
  productsSeed,
  settingsSeed,
  shipmentsSeed,
  ticketsSeed,
  vendorAccounts,
  webhooksSeed,
} from '../mock/data';
import type {
  Announcement,
  ApiKey,
  AppSettings,
  ImportJob,
  ImportType,
  Order,
  Product,
  Shipment,
  Ticket,
  VendorAccount,
  Webhook,
} from '../mock/types';
import type { ToastItem } from '../components/ui/Toast';

type AppContextType = {
  isLoggedIn: boolean;
  currentVendor: VendorAccount | null;
  vendors: VendorAccount[];
  products: Product[];
  orders: Order[];
  shipments: Shipment[];
  announcements: Announcement[];
  tickets: Ticket[];
  apiKeys: ApiKey[];
  webhooks: Webhook[];
  importJobs: ImportJob[];
  financeTransactions: typeof financeTransactionsSeed;
  payouts: typeof payoutsSeed;
  settings: AppSettings;
  toasts: ToastItem[];
  login: (vendorId: string) => void;
  logout: () => void;
  pushToast: (message: string) => void;
  saveVendorProfile: (vendor: VendorAccount) => void;
  saveProduct: (product: Product) => void;
  updateProductStatus: (id: string, status: Product['status']) => void;
  updateStock: (id: string, stock: number, threshold?: number) => void;
  createImportJob: (type: ImportType, fileName: string) => void;
  createApiKey: (name: string) => void;
  revokeApiKey: (id: string) => void;
  updateOrderStatus: (id: string, status: Order['orderStatus'], shipmentStatus?: Order['shipmentStatus']) => void;
  createShipment: (input: Omit<Shipment, 'id' | 'shipmentNumber'>) => void;
  updateShipmentStatus: (id: string, status: Shipment['status']) => void;
  markAnnouncementRead: (id: string) => void;
  createTicket: (input: Pick<Ticket, 'title' | 'category'>) => void;
  addTicketMessage: (id: string, text: string) => void;
  saveSettings: (settings: AppSettings) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  const [vendors, setVendors] = useState(vendorAccounts);
  const [currentVendorId, setCurrentVendorId] = useState<string | null>(vendorAccounts[0].id);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState(productsSeed);
  const [orders, setOrders] = useState(ordersSeed);
  const [shipments, setShipments] = useState(shipmentsSeed);
  const [announcements, setAnnouncements] = useState(announcementsSeed);
  const [tickets, setTickets] = useState(ticketsSeed);
  const [apiKeys, setApiKeys] = useState(apiKeysSeed);
  const [webhooks] = useState(webhooksSeed);
  const [importJobs, setImportJobs] = useState(importJobsSeed);
  const [financeTransactions] = useState(financeTransactionsSeed);
  const [payouts] = useState(payoutsSeed);
  const [settings, setSettings] = useState(settingsSeed);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = (message: string) => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message }]);
  };

  useEffect(() => {
    if (!toasts.length) return;
    const timer = window.setTimeout(() => {
      setToasts((current) => current.slice(1));
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [toasts]);

  const value = useMemo<AppContextType>(() => {
    const currentVendor = vendors.find((vendor) => vendor.id === currentVendorId) ?? null;
    return {
      isLoggedIn,
      currentVendor,
      vendors,
      products,
      orders,
      shipments,
      announcements,
      tickets,
      apiKeys,
      webhooks,
      importJobs,
      financeTransactions,
      payouts,
      settings,
      toasts,
      login: (vendorId) => {
        setCurrentVendorId(vendorId);
        setIsLoggedIn(true);
        pushToast('Signed in to vendor panel');
      },
      logout: () => {
        setIsLoggedIn(false);
        pushToast('Logged out');
      },
      pushToast,
      saveVendorProfile: (vendor) => {
        setVendors((current) => current.map((item) => (item.id === vendor.id ? vendor : item)));
        pushToast('Company profile updated');
      },
      saveProduct: (product) => {
        setProducts((current) => {
          const exists = current.some((item) => item.id === product.id);
          return exists ? current.map((item) => (item.id === product.id ? product : item)) : [product, ...current];
        });
        pushToast(`Product ${product.id.startsWith('prod-') ? 'saved' : 'created'}`);
      },
      updateProductStatus: (id, status) => {
        setProducts((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
        pushToast(`Product status changed to ${status}`);
      },
      updateStock: (id, stock, threshold) => {
        setProducts((current) =>
          current.map((item) =>
            item.id === id ? { ...item, stock, lowStockThreshold: threshold ?? item.lowStockThreshold } : item,
          ),
        );
        pushToast('Stock updated');
      },
      createImportJob: (type, fileName) => {
        setImportJobs((current) => [
          {
            id: `imp-${current.length + 1}`,
            type,
            fileName,
            status: 'processing',
            createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
            successRows: 0,
            failedRows: 0,
            errors: [],
          },
          ...current,
        ]);
        pushToast(`${type} import started`);
      },
      createApiKey: (name) => {
        setApiKeys((current) => [
          {
            id: `key-${current.length + 1}`,
            name,
            keyPreview: `vp_live_${Math.random().toString(36).slice(2, 6)}...${Math.random().toString(36).slice(2, 6)}`,
            createdAt: new Date().toISOString().slice(0, 10),
            lastUsed: 'Never',
            status: 'active',
          },
          ...current,
        ]);
        pushToast('API key created');
      },
      revokeApiKey: (id) => {
        setApiKeys((current) => current.map((item) => (item.id === id ? { ...item, status: 'revoked' } : item)));
        pushToast('API key revoked');
      },
      updateOrderStatus: (id, status, shipmentStatus) => {
        setOrders((current) =>
          current.map((item) =>
            item.id === id
              ? {
                  ...item,
                  orderStatus: status,
                  shipmentStatus: shipmentStatus ?? item.shipmentStatus,
                }
              : item,
          ),
        );
        pushToast(`Order updated to ${status}`);
      },
      createShipment: (input) => {
        const nextShipmentNumber = `SHP-${9000 + shipments.length + 1}`;
        const shipment: Shipment = { ...input, id: `shipment-${shipments.length + 1}`, shipmentNumber: nextShipmentNumber };
        setShipments((current) => [shipment, ...current]);
        setOrders((current) =>
          current.map((order) =>
            order.id === input.orderId
              ? { ...order, shipmentId: shipment.id, shipmentStatus: 'pending', orderStatus: 'packed' }
              : order,
          ),
        );
        pushToast('Shipment created');
      },
      updateShipmentStatus: (id, status) => {
        setShipments((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
        pushToast(`Shipment marked ${status}`);
      },
      markAnnouncementRead: (id) => {
        setAnnouncements((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
      },
      createTicket: (input) => {
        setTickets((current) => [
          {
            id: `ticket-${current.length + 1}`,
            title: input.title,
            category: input.category,
            status: 'open',
            createdAt: new Date().toISOString().slice(0, 10),
            updatedAt: new Date().toISOString().slice(0, 10),
            messages: [{ sender: 'vendor', text: input.title, date: new Date().toISOString().slice(0, 16).replace('T', ' ') }],
          },
          ...current,
        ]);
        pushToast('Support ticket created');
      },
      addTicketMessage: (id, text) => {
        setTickets((current) =>
          current.map((item) =>
            item.id === id
              ? {
                  ...item,
                  updatedAt: new Date().toISOString().slice(0, 10),
                  messages: [...item.messages, { sender: 'vendor', text, date: new Date().toISOString().slice(0, 16).replace('T', ' ') }],
                }
              : item,
          ),
        );
        pushToast('Ticket message sent');
      },
      saveSettings: (nextSettings) => {
        setSettings(nextSettings);
        pushToast('Settings saved');
      },
    };
  }, [
    announcements,
    apiKeys,
    financeTransactions,
    importJobs,
    isLoggedIn,
    orders,
    payouts,
    products,
    settings,
    shipments,
    tickets,
    toasts,
    vendors,
    webhooks,
    currentVendorId,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}

export type UserRole = 'owner' | 'operations' | 'finance';
export type ProductStatus = 'draft' | 'in_review' | 'active' | 'rejected' | 'inactive';
export type OrderStatus = 'new' | 'accepted' | 'rejected' | 'preparing' | 'packed' | 'shipped' | 'delivered';
export type ShipmentStatus =
  | 'pending'
  | 'packed'
  | 'handed_to_carrier'
  | 'in_transit'
  | 'delivered'
  | 'failed_delivery'
  | 'returned';
export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type TicketCategory = 'finance' | 'operations' | 'technical' | 'catalog';
export type ImportJobStatus = 'completed' | 'failed' | 'processing';
export type ImportType = 'product' | 'stock' | 'price';
export type TransactionType = 'sale' | 'commission' | 'adjustment' | 'penalty' | 'payout' | 'refund_deduction';

export interface VendorAccount {
  id: string;
  name: string;
  legalName: string;
  taxNumber: string;
  billingAddress: string;
  iban: string;
  bankName: string;
  contacts: { name: string; title: string; email: string; phone: string }[];
  users: { id: string; name: string; email: string; role: UserRole; status: 'active' | 'invited' }[];
  contractAccepted: boolean;
  commissionRate: number;
  payoutCycle: string;
  shippingResponsibility: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  vat: number;
  stock: number;
  reservedStock: number;
  lowStockThreshold: number;
  imageUrl: string;
  status: ProductStatus;
  catalogStatus: 'matched' | 'new_review';
}

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerCity: string;
  address: string;
  itemCount: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  shipmentStatus: ShipmentStatus | 'not_created';
  notes: string;
  items: OrderItem[];
  financialSummary: { subtotal: number; shippingFee: number; commission: number; net: number };
  timeline: { label: string; date: string; done: boolean }[];
  shipmentId?: string;
}

export interface Shipment {
  id: string;
  shipmentNumber: string;
  orderId: string;
  orderNumber: string;
  carrier: string;
  trackingNumber: string;
  status: ShipmentStatus;
  shipByDate: string;
  estimatedDelivery: string;
  delayed: boolean;
  slaRisk: boolean;
  note: string;
}

export interface FinanceTransaction {
  id: string;
  date: string;
  orderNumber?: string;
  type: TransactionType;
  description: string;
  amount: number;
  balanceAfter: number;
}

export interface Payout {
  id: string;
  payoutDate: string;
  amount: number;
  status: 'scheduled' | 'paid';
  settlementFile: string;
}

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  body: string;
  date: string;
  pinned: boolean;
  read: boolean;
  critical: boolean;
  tags: string[];
}

export interface Ticket {
  id: string;
  title: string;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  orderNumber?: string;
  messages: { sender: 'vendor' | 'support'; text: string; date: string }[];
}

export interface ApiKey {
  id: string;
  name: string;
  keyPreview: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

export interface Webhook {
  id: string;
  event: string;
  url: string;
  status: 'active' | 'failing';
}

export interface ImportJob {
  id: string;
  type: ImportType;
  fileName: string;
  status: ImportJobStatus;
  createdAt: string;
  successRows: number;
  failedRows: number;
  errors: { row: number; field: string; message: string }[];
}

export interface AppSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  defaultCarrier: string;
  defaultPreparationNote: string;
  autoCreateShipmentDraft: boolean;
  companyLanguage: string;
}

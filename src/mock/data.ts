import type {
  Announcement,
  ApiKey,
  AppSettings,
  FinanceTransaction,
  ImportJob,
  Order,
  Payout,
  Product,
  Shipment,
  Ticket,
  VendorAccount,
  Webhook,
} from './types';

export const vendorAccounts: VendorAccount[] = [
  {
    id: 'v1',
    name: 'FreshRoute',
    legalName: 'FreshRoute Gida ve Lojistik A.S.',
    taxNumber: '4567891234',
    billingAddress: 'Ataturk Mah. Nar Cad. No:18, Umraniye / Istanbul',
    iban: 'TR12 0006 2000 0000 1234 5678 90',
    bankName: 'Garanti BBVA',
    contacts: [
      { name: 'Aylin Kaya', title: 'Account Owner', email: 'aylin@freshroute.com', phone: '+90 532 100 10 10' },
      { name: 'Mert Polat', title: 'Operations Lead', email: 'mert@freshroute.com', phone: '+90 532 200 20 20' },
    ],
    users: [
      { id: 'u1', name: 'Aylin Kaya', email: 'aylin@freshroute.com', role: 'owner', status: 'active' },
      { id: 'u2', name: 'Mert Polat', email: 'mert@freshroute.com', role: 'operations', status: 'active' },
      { id: 'u3', name: 'Selin Yuce', email: 'selin@freshroute.com', role: 'finance', status: 'invited' },
    ],
    contractAccepted: true,
    commissionRate: 12,
    payoutCycle: 'Weekly payout every Friday',
    shippingResponsibility: 'Vendor ships and updates tracking',
  },
  {
    id: 'v2',
    name: 'Anadolu Organik',
    legalName: 'Anadolu Organik Urunler Ltd. Sti.',
    taxNumber: '2345678912',
    billingAddress: 'Beylikduzu OSB 3. Cadde No:6, Istanbul',
    iban: 'TR44 0011 1000 0000 2222 3333 44',
    bankName: 'Akbank',
    contacts: [{ name: 'Can Demir', title: 'Owner', email: 'can@anadoluorganik.com', phone: '+90 532 300 30 30' }],
    users: [
      { id: 'u4', name: 'Can Demir', email: 'can@anadoluorganik.com', role: 'owner', status: 'active' },
      { id: 'u5', name: 'Naz Ozturk', email: 'naz@anadoluorganik.com', role: 'operations', status: 'active' },
    ],
    contractAccepted: false,
    commissionRate: 10,
    payoutCycle: 'Bi-weekly payout',
    shippingResponsibility: 'Vendor packs, platform books carrier',
  },
];

const productRows: Array<
  [string, string, string, string, string, number, number, number, number, Product['status'], Product['catalogStatus']]
> = [
  ['P001', '8690001000011', 'Organic Banana 1kg', 'Fruits', 'FreshRoute', 89.9, 1, 42, 5, 'active', 'matched'],
  ['P002', '8690001000012', 'Avocado Hass 2pcs', 'Fruits', 'FreshRoute', 74.5, 1, 18, 4, 'active', 'matched'],
  ['P003', '8690001000013', 'Baby Spinach 250g', 'Vegetables', 'FreshRoute', 39.9, 1, 7, 6, 'active', 'matched'],
  ['P004', '8690001000014', 'Cherry Tomato 500g', 'Vegetables', 'FreshRoute', 29.9, 1, 64, 8, 'active', 'matched'],
  ['P005', '8690001000015', 'Sourdough Bread', 'Bakery', 'Village Bake', 54.9, 10, 12, 5, 'in_review', 'new_review'],
  ['P006', '8690001000016', 'Almond Milk 1L', 'Beverages', 'Nutrio', 67.9, 10, 25, 10, 'active', 'matched'],
  ['P007', '8690001000017', 'Greek Yogurt 500g', 'Dairy', 'Farm Daily', 44.9, 1, 0, 6, 'inactive', 'matched'],
  ['P008', '8690001000018', 'Free Range Eggs 10pcs', 'Dairy', 'Farm Daily', 79.9, 1, 33, 10, 'draft', 'new_review'],
  ['P009', '8690001000019', 'Granola Honey 300g', 'Breakfast', 'CrunchLab', 58.5, 10, 19, 7, 'rejected', 'new_review'],
  ['P010', '8690001000020', 'Mineral Water 6x200ml', 'Beverages', 'PureDrop', 34.9, 20, 88, 15, 'active', 'matched'],
  ['P011', '8690001000021', 'Red Lentils 1kg', 'Pantry', 'Anadolu Organik', 46.9, 1, 55, 12, 'active', 'matched'],
  ['P012', '8690001000022', 'Cold Press Olive Oil 750ml', 'Pantry', 'Aegean Gold', 219.9, 1, 9, 4, 'active', 'matched'],
];

export const productsSeed: Product[] = productRows.map(([sku, barcode, name, category, brand, price, vat, stock, threshold, status, catalogStatus], index) => ({
  id: `prod-${index + 1}`,
  sku,
  barcode,
  name,
  category,
  brand,
  description: `${name} for marketplace demo listing.`,
  price,
  vat,
  stock,
  reservedStock: Math.min(3, Math.max(0, stock - 1)),
  lowStockThreshold: threshold,
  imageUrl: `https://picsum.photos/seed/${sku}/80/80`,
  status,
  catalogStatus,
}));

const orderRows: Array<[string, string, string, Order['orderStatus'], Order['shipmentStatus'], number, number]> = [
  ['100001', '2026-04-13T08:10:00', 'Istanbul', 'new', 'not_created', 2, 164.4],
  ['100002', '2026-04-13T07:50:00', 'Ankara', 'accepted', 'pending', 3, 248.7],
  ['100003', '2026-04-12T17:20:00', 'Izmir', 'preparing', 'packed', 1, 89.9],
  ['100004', '2026-04-12T15:40:00', 'Bursa', 'packed', 'handed_to_carrier', 4, 314.2],
  ['100005', '2026-04-12T13:30:00', 'Antalya', 'shipped', 'in_transit', 2, 129.8],
  ['100006', '2026-04-11T12:20:00', 'Kocaeli', 'delivered', 'delivered', 5, 402.4],
  ['100007', '2026-04-11T09:10:00', 'Adana', 'rejected', 'failed_delivery', 1, 58.5],
  ['100008', '2026-04-10T19:00:00', 'Istanbul', 'accepted', 'pending', 2, 111.8],
  ['100009', '2026-04-10T14:05:00', 'Eskisehir', 'preparing', 'pending', 2, 121.4],
  ['100010', '2026-04-09T11:35:00', 'Mersin', 'shipped', 'in_transit', 3, 267.6],
];

export const ordersSeed: Order[] = orderRows.map(([orderNumber, date, city, orderStatus, shipmentStatus, itemCount, totalAmount], index) => {
  const itemA = productsSeed[index % productsSeed.length];
  const itemB = productsSeed[(index + 3) % productsSeed.length];
  return {
    id: `order-${index + 1}`,
    orderNumber,
    date,
    customerName: `Customer ${index + 1}`,
    customerCity: city,
    address: `${city} Demo Mah. No:${index + 5}`,
    itemCount,
    totalAmount,
    orderStatus,
    shipmentStatus,
    notes: index % 2 === 0 ? 'Leave at reception if unavailable.' : 'Call before delivery.',
    items: [
      { productId: itemA.id, sku: itemA.sku, name: itemA.name, quantity: 1, unitPrice: itemA.price },
      { productId: itemB.id, sku: itemB.sku, name: itemB.name, quantity: Math.max(1, itemCount - 1), unitPrice: itemB.price },
    ],
    financialSummary: {
      subtotal: totalAmount - 19.9,
      shippingFee: 19.9,
      commission: Number((totalAmount * 0.12).toFixed(2)),
      net: Number((totalAmount * 0.88).toFixed(2)),
    },
    timeline: [
      { label: 'Order created', date, done: true },
      { label: 'Vendor accepted', date, done: orderStatus !== 'new' && orderStatus !== 'rejected' },
      { label: 'Preparing', date, done: ['preparing', 'packed', 'shipped', 'delivered'].includes(orderStatus) },
      { label: 'Packed', date, done: ['packed', 'shipped', 'delivered'].includes(orderStatus) },
      { label: 'Delivered', date, done: orderStatus === 'delivered' },
    ],
  };
});

const shipmentRows: Array<[string, string, string, string, Shipment['status'], string, string, boolean, boolean]> = [
  ['SHP-9001', '100002', 'Yurtiçi', 'YT123456', 'pending', '2026-04-13', '2026-04-14', false, true],
  ['SHP-9002', '100003', 'MNG', 'MNG12345', 'packed', '2026-04-13', '2026-04-14', false, false],
  ['SHP-9003', '100004', 'Aras', 'ARS81234', 'handed_to_carrier', '2026-04-12', '2026-04-13', false, false],
  ['SHP-9004', '100005', 'Yurtiçi', 'YT123457', 'in_transit', '2026-04-12', '2026-04-14', false, false],
  ['SHP-9005', '100006', 'HepsiJet', 'HJ778899', 'delivered', '2026-04-10', '2026-04-11', false, false],
  ['SHP-9006', '100007', 'MNG', 'MNG12399', 'failed_delivery', '2026-04-10', '2026-04-12', true, true],
  ['SHP-9007', '100009', 'Aras', 'ARS81266', 'pending', '2026-04-13', '2026-04-15', false, true],
  ['SHP-9008', '100010', 'HepsiJet', 'HJ778800', 'returned', '2026-04-10', '2026-04-13', true, true],
];

export const shipmentsSeed: Shipment[] = shipmentRows.map(([shipmentNumber, orderNumber, carrier, trackingNumber, status, shipByDate, estimatedDelivery, delayed, slaRisk], index) => ({
  id: `shipment-${index + 1}`,
  shipmentNumber,
  orderId: ordersSeed.find((order) => order.orderNumber === orderNumber)!.id,
  orderNumber,
  carrier,
  trackingNumber,
  status,
  shipByDate,
  estimatedDelivery,
  delayed,
  slaRisk,
  note: delayed ? 'Monitor carrier handoff closely.' : 'Standard shipment flow.',
}));

const financeRows: Array<[string, string | undefined, FinanceTransaction['type'], string, number, number]> = [
  ['2026-04-13', '100001', 'sale', 'Order sale booked', 164.4, 164.4],
  ['2026-04-13', '100001', 'commission', 'Marketplace commission', -19.73, 144.67],
  ['2026-04-12', '100004', 'sale', 'Order sale booked', 314.2, 458.87],
  ['2026-04-12', '100004', 'commission', 'Marketplace commission', -37.7, 421.17],
  ['2026-04-11', undefined, 'adjustment', 'Manual inventory adjustment credit', 55, 476.17],
  ['2026-04-11', undefined, 'penalty', 'Late shipment SLA penalty', -25, 451.17],
  ['2026-04-10', undefined, 'payout', 'Weekly payout transfer', -300, 151.17],
  ['2026-04-09', '100007', 'refund_deduction', 'Rejected order reversal', -58.5, 92.67],
];

export const financeTransactionsSeed: FinanceTransaction[] = financeRows.map(([date, orderNumber, type, description, amount, balanceAfter], index) => ({
  id: `txn-${index + 1}`,
  date,
  orderNumber,
  type,
  description,
  amount,
  balanceAfter,
}));

export const payoutsSeed: Payout[] = [
  { id: 'pay-1', payoutDate: '2026-04-12', amount: 300, status: 'paid', settlementFile: 'settlement_2026_04_12.csv' },
  { id: 'pay-2', payoutDate: '2026-04-19', amount: 451.17, status: 'scheduled', settlementFile: 'settlement_2026_04_19.csv' },
];

export const announcementsSeed: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Cold Chain Packaging Rule Update',
    summary: 'Perishable SKUs now require gel pack usage on all next-day shipments.',
    body: 'Starting April 15, all cold chain orders must include gel packs and insulated liners. Vendors remain responsible for packaging compliance.',
    date: '2026-04-13',
    pinned: true,
    read: false,
    critical: true,
    tags: ['critical', 'operations'],
  },
  {
    id: 'ann-2',
    title: 'Weekly Payout File Format Refresh',
    summary: 'Settlement files now include campaign subsidy and return deduction columns.',
    body: 'Finance exports have been updated to simplify reconciliation. Please align your internal parser before the April 19 payout cycle.',
    date: '2026-04-12',
    pinned: true,
    read: false,
    critical: false,
    tags: ['finance'],
  },
  {
    id: 'ann-3',
    title: 'Catalog Review SLA Improvement',
    summary: 'New product review target reduced from 48 hours to 24 hours.',
    body: 'Catalog team has improved queue handling. Newly submitted vendor products should now be reviewed within one business day.',
    date: '2026-04-11',
    pinned: false,
    read: true,
    critical: false,
    tags: ['catalog'],
  },
  {
    id: 'ann-4',
    title: 'Shipment Delay Monitoring Enabled',
    summary: 'Vendor panel now flags pending shipments that risk missing ship-by SLA.',
    body: 'Use the Shipments page to identify risky shipments and take action before platform penalties apply.',
    date: '2026-04-10',
    pinned: false,
    read: true,
    critical: false,
    tags: ['operations', 'shipping'],
  },
  {
    id: 'ann-5',
    title: 'API Rate Limit Reminder',
    summary: 'Bulk stock sync clients should respect 120 requests/minute limit.',
    body: 'Please throttle integration clients appropriately. Repeated abuse may temporarily suspend API keys.',
    date: '2026-04-09',
    pinned: false,
    read: false,
    critical: true,
    tags: ['technical', 'critical'],
  },
];

const ticketRows: Array<[string, Ticket['category'], Ticket['status']]> = [
  ['Inventory sync mismatch', 'technical', 'open'],
  ['Commission calculation check', 'finance', 'pending'],
  ['Catalog rejection appeal', 'catalog', 'resolved'],
  ['Late carrier pickup', 'operations', 'open'],
  ['Missing settlement line', 'finance', 'closed'],
  ['Barcode conflict on new SKU', 'catalog', 'pending'],
  ['Webhook retries failing', 'technical', 'open'],
  ['Order cancellation handling', 'operations', 'resolved'],
];

export const ticketsSeed: Ticket[] = ticketRows.map(([title, category, status], index) => ({
  id: `ticket-${index + 1}`,
  title,
  category,
  status,
  createdAt: `2026-04-${String(13 - index).padStart(2, '0')}`,
  updatedAt: `2026-04-${String(13 - index).padStart(2, '0')}`,
  orderNumber: index % 2 === 0 ? ordersSeed[index]?.orderNumber : undefined,
  messages: [
    { sender: 'vendor', text: `Need help with: ${title}.`, date: `2026-04-${String(13 - index).padStart(2, '0')} 10:00` },
    { sender: 'support', text: 'We are reviewing the request and will update shortly.', date: `2026-04-${String(13 - index).padStart(2, '0')} 11:15` },
  ],
}));

export const apiKeysSeed: ApiKey[] = [
  { id: 'key-1', name: 'ERP Sync', keyPreview: 'vp_live_3fA1...91ab', createdAt: '2026-03-02', lastUsed: '2026-04-13 08:42', status: 'active' },
  { id: 'key-2', name: 'WMS Connector', keyPreview: 'vp_live_4bD2...21ce', createdAt: '2026-03-18', lastUsed: '2026-04-12 22:10', status: 'active' },
  { id: 'key-3', name: 'Legacy Test Client', keyPreview: 'vp_test_8zP4...71yy', createdAt: '2026-02-06', lastUsed: '2026-03-30 14:05', status: 'revoked' },
];

export const webhooksSeed: Webhook[] = [
  { id: 'wh-1', event: 'new_order', url: 'https://vendor.example.com/webhooks/order', status: 'active' },
  { id: 'wh-2', event: 'order_cancelled', url: 'https://vendor.example.com/webhooks/cancel', status: 'active' },
  { id: 'wh-3', event: 'shipment_delayed', url: 'https://vendor.example.com/webhooks/shipment', status: 'failing' },
  { id: 'wh-4', event: 'payout_created', url: 'https://vendor.example.com/webhooks/payout', status: 'active' },
];

export const importJobsSeed: ImportJob[] = [
  {
    id: 'imp-1',
    type: 'product',
    fileName: 'products_april_13.xlsx',
    status: 'completed',
    createdAt: '2026-04-13 08:30',
    successRows: 120,
    failedRows: 2,
    errors: [{ row: 17, field: 'barcode', message: 'Barcode already exists.' }],
  },
  {
    id: 'imp-2',
    type: 'stock',
    fileName: 'stock_morning.csv',
    status: 'failed',
    createdAt: '2026-04-13 07:45',
    successRows: 0,
    failedRows: 50,
    errors: [{ row: 1, field: 'file', message: 'Template header mismatch.' }],
  },
  {
    id: 'imp-3',
    type: 'price',
    fileName: 'price_update_week15.csv',
    status: 'processing',
    createdAt: '2026-04-12 18:00',
    successRows: 0,
    failedRows: 0,
    errors: [],
  },
  {
    id: 'imp-4',
    type: 'stock',
    fileName: 'stock_evening.csv',
    status: 'completed',
    createdAt: '2026-04-12 17:05',
    successRows: 88,
    failedRows: 4,
    errors: [{ row: 44, field: 'stock', message: 'Negative quantity not allowed.' }],
  },
  {
    id: 'imp-5',
    type: 'product',
    fileName: 'new_skus_march.xlsx',
    status: 'completed',
    createdAt: '2026-04-08 09:20',
    successRows: 32,
    failedRows: 1,
    errors: [{ row: 6, field: 'vat', message: 'Unsupported VAT rate.' }],
  },
];

export const settingsSeed: AppSettings = {
  emailNotifications: true,
  smsNotifications: false,
  defaultCarrier: 'Yurtiçi',
  defaultPreparationNote: 'Pack chilled items separately.',
  autoCreateShipmentDraft: true,
  companyLanguage: 'English',
};

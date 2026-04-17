import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppContext } from '../app/AppProvider';
import { LoginPage } from '../app/LoginPage';
import { AppShell } from '../layout/AppShell';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { CompanyPage } from '../features/company/CompanyPage';
import { ProductsPage } from '../features/products/ProductsPage';
import { InventoryPage } from '../features/inventory/InventoryPage';
import { BulkUploadPage } from '../features/bulk-upload/BulkUploadPage';
import { ApiPage } from '../features/api/ApiPage';
import { OrderDetailPage, OrdersPage } from '../features/orders/OrdersPage';
import { ShipmentCreatePage, ShipmentDetailPage, ShipmentsPage } from '../features/shipments/ShipmentsPage';
import { FinancePage } from '../features/finance/FinancePage';
import { AnnouncementsPage } from '../features/announcements/AnnouncementsPage';
import { TicketsPage } from '../features/tickets/TicketsPage';
import { SettingsPage } from '../features/settings/SettingsPage';

function ProtectedRoutes() {
  const { isLoggedIn } = useAppContext();

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/bulk-upload" element={<BulkUploadPage />} />
        <Route path="/api" element={<ApiPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/shipments" element={<ShipmentsPage />} />
        <Route path="/shipments/new" element={<ShipmentCreatePage />} />
        <Route path="/shipments/new/:orderId" element={<ShipmentCreatePage />} />
        <Route path="/shipments/:id" element={<ShipmentDetailPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function AppRoutes() {
  const { isLoggedIn } = useAppContext();

  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

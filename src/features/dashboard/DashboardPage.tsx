import { Card, CardHeader } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatCard } from '../../components/shared/StatCard';
import { useAppContext } from '../../app/AppProvider';
import { Badge } from '../../components/ui/Badge';

export function DashboardPage() {
  const { orders, shipments, products, tickets, announcements, financeTransactions } = useAppContext();
  const today = '2026-04-13';
  const todaysOrders = orders.filter((order) => order.date.startsWith(today)).length;
  const pendingOrders = orders.filter((order) => ['new', 'accepted', 'preparing'].includes(order.orderStatus)).length;
  const pendingShipments = shipments.filter((shipment) => ['pending', 'packed'].includes(shipment.status)).length;
  const delayedShipments = shipments.filter((shipment) => shipment.delayed).length;
  const lowStock = products.filter((product) => product.stock <= product.lowStockThreshold).length;
  const openTickets = tickets.filter((ticket) => ticket.status === 'open').length;
  const estimatedBalance = financeTransactions[financeTransactions.length - 1]?.balanceAfter ?? 0;
  const recentOrders = orders.slice(0, 5);
  const slaAlerts = shipments.filter((shipment) => shipment.slaRisk).slice(0, 4);

  return (
    <div className="page-grid">
      <PageHeader title="Vendor Dashboard" subtitle="Monitor core marketplace operations from one place." />
      <div className="stats-grid">
        <StatCard label="Today's Orders" value={String(todaysOrders)} />
        <StatCard label="Pending Orders" value={String(pendingOrders)} />
        <StatCard label="Pending Shipments" value={String(pendingShipments)} />
        <StatCard label="Delayed Shipments" value={String(delayedShipments)} />
        <StatCard label="Low Stock Products" value={String(lowStock)} />
        <StatCard label="Open Tickets" value={String(openTickets)} />
        <StatCard label="Estimated Balance" value={`TRY ${estimatedBalance.toFixed(2)}`} />
      </div>
      <div className="two-col">
        <Card>
          <CardHeader title="Recent Announcements" subtitle="Pinned and latest updates for vendors" />
          <div className="stack">
            {announcements.slice(0, 4).map((announcement) => (
              <div className="list-item" key={announcement.id}>
                <div>
                  <strong>{announcement.title}</strong>
                  <p>{announcement.summary}</p>
                </div>
                <div className="inline-row">
                  {announcement.critical ? <Badge label="Critical" tone="danger" /> : null}
                  {!announcement.read ? <Badge label="Unread" tone="info" /> : null}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Shipment SLA Alerts" subtitle="Orders at risk of missing ship-by target" />
          <div className="stack">
            {slaAlerts.map((shipment) => (
              <div className="list-item" key={shipment.id}>
                <div>
                  <strong>{shipment.shipmentNumber}</strong>
                  <p>
                    Order {shipment.orderNumber} · {shipment.carrier}
                  </p>
                </div>
                <Badge label={shipment.delayed ? 'Delayed' : 'SLA Risk'} tone={shipment.delayed ? 'danger' : 'warning'} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <CardHeader title="Recent Orders" subtitle="Latest vendor order activity" />
        <Table columns={['Order', 'Date', 'City', 'Total', 'Order Status', 'Shipment']}>
          {recentOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.orderNumber}</td>
              <td>{order.date.slice(0, 16).replace('T', ' ')}</td>
              <td>{order.customerCity}</td>
              <td>TRY {order.totalAmount.toFixed(2)}</td>
              <td><Badge label={order.orderStatus} tone={order.orderStatus === 'rejected' ? 'danger' : 'info'} /></td>
              <td><Badge label={order.shipmentStatus} tone={order.shipmentStatus === 'not_created' ? 'warning' : 'default'} /></td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

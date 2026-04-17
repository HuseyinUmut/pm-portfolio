import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table } from '../../components/ui/Table';
import { useAppContext } from '../../app/AppProvider';

export function OrdersPage() {
  const { orders, updateOrderStatus } = useAppContext();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState('all');
  const [shipmentStatus, setShipmentStatus] = useState('all');
  const [date, setDate] = useState('');
  const [sku, setSku] = useState('');
  const [city, setCity] = useState('');

  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const matchesOrder = orderStatus === 'all' || order.orderStatus === orderStatus;
        const matchesShipment = shipmentStatus === 'all' || order.shipmentStatus === shipmentStatus;
        const matchesDate = !date || order.date.startsWith(date);
        const matchesSku = !sku || order.items.some((item) => item.sku.toLowerCase().includes(sku.toLowerCase()));
        const matchesCity = !city || order.customerCity.toLowerCase().includes(city.toLowerCase());
        return matchesOrder && matchesShipment && matchesDate && matchesSku && matchesCity;
      }),
    [orders, orderStatus, shipmentStatus, date, sku, city],
  );

  return (
    <div className="page-grid">
      <PageHeader title="Orders" subtitle="Accept, reject, and process marketplace orders." />
      <Card>
        <CardHeader title="Filters" />
        <div className="filters">
          <Select value={orderStatus} onChange={(event) => setOrderStatus(event.target.value)}>
            <option value="all">All order statuses</option>
            {['new', 'accepted', 'rejected', 'preparing', 'packed', 'shipped', 'delivered'].map((value) => <option key={value}>{value}</option>)}
          </Select>
          <Select value={shipmentStatus} onChange={(event) => setShipmentStatus(event.target.value)}>
            <option value="all">All shipment statuses</option>
            {['not_created', 'pending', 'packed', 'handed_to_carrier', 'in_transit', 'delivered', 'failed_delivery', 'returned'].map((value) => <option key={value}>{value}</option>)}
          </Select>
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <Input placeholder="Filter by SKU" value={sku} onChange={(event) => setSku(event.target.value)} />
          <Input placeholder="Customer city" value={city} onChange={(event) => setCity(event.target.value)} />
        </div>
      </Card>
      <Card>
        <Table columns={['Order Number', 'Date', 'Customer City', 'Item Count', 'Total Amount', 'Order Status', 'Shipment Status', 'Actions']}>
          {filtered.map((order) => (
            <tr key={order.id}>
              <td>{order.orderNumber}</td>
              <td>{order.date.slice(0, 10)}</td>
              <td>{order.customerCity}</td>
              <td>{order.itemCount}</td>
              <td>TRY {order.totalAmount.toFixed(2)}</td>
              <td><Badge label={order.orderStatus} tone={order.orderStatus === 'rejected' ? 'danger' : 'info'} /></td>
              <td><Badge label={order.shipmentStatus} tone={order.shipmentStatus === 'not_created' ? 'warning' : 'default'} /></td>
              <td>
                <div className="inline-row">
                  <Button variant="secondary" onClick={() => updateOrderStatus(order.id, 'accepted')}>Accept</Button>
                  <Button variant="danger" onClick={() => updateOrderStatus(order.id, 'rejected', 'failed_delivery')}>Reject</Button>
                  <Button variant="ghost" onClick={() => navigate(`/orders/${order.id}`)}>View Details</Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, shipments, updateOrderStatus } = useAppContext();
  const order = orders.find((item) => item.id === id);
  const shipment = shipments.find((item) => item.orderId === id);

  if (!order) return <div>Order not found.</div>;

  return (
    <div className="page-grid">
      <PageHeader title={`Order ${order.orderNumber}`} subtitle="Customer, financial, and shipment summary." actionLabel="Back to Orders" onAction={() => navigate('/orders')} />
      <div className="three-col">
        <Card>
          <CardHeader title="Customer Summary" />
          <div className="stack">
            <div className="list-item"><span>Name</span><strong>{order.customerName}</strong></div>
            <div className="list-item"><span>City</span><strong>{order.customerCity}</strong></div>
            <div className="list-item"><span>Delivery Address</span><strong>{order.address}</strong></div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Financial Summary" />
          <div className="stack">
            <div className="list-item"><span>Subtotal</span><strong>TRY {order.financialSummary.subtotal.toFixed(2)}</strong></div>
            <div className="list-item"><span>Shipping Fee</span><strong>TRY {order.financialSummary.shippingFee.toFixed(2)}</strong></div>
            <div className="list-item"><span>Commission</span><strong>TRY {order.financialSummary.commission.toFixed(2)}</strong></div>
            <div className="list-item"><span>Net</span><strong>TRY {order.financialSummary.net.toFixed(2)}</strong></div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Shipment Summary" />
          <div className="stack">
            <div className="list-item"><span>Shipment status</span><Badge label={order.shipmentStatus} tone="warning" /></div>
            <div className="list-item"><span>Carrier</span><strong>{shipment?.carrier ?? 'Not created'}</strong></div>
            <div className="list-item"><span>Tracking</span><strong>{shipment?.trackingNumber ?? '-'}</strong></div>
          </div>
        </Card>
      </div>
      <Card>
        <CardHeader title="Ordered Items" />
        <Table columns={['SKU', 'Product', 'Qty', 'Unit Price']}>
          {order.items.map((item) => (
            <tr key={item.sku}>
              <td>{item.sku}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>TRY {item.unitPrice.toFixed(2)}</td>
            </tr>
          ))}
        </Table>
      </Card>
      <div className="two-col">
        <Card>
          <CardHeader title="Status Timeline" />
          <div className="timeline">
            {order.timeline.map((item) => (
              <div className="timeline-item" key={item.label}>
                <strong>{item.label}</strong>
                <p>{item.date.slice(0, 16).replace('T', ' ')} · {item.done ? 'done' : 'pending'}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Actions" />
          <div className="stack">
            <p>{order.notes}</p>
            <div className="button-column">
              <Button onClick={() => updateOrderStatus(order.id, 'accepted')}>Accept Order</Button>
              <Button variant="danger" onClick={() => updateOrderStatus(order.id, 'rejected', 'failed_delivery')}>Reject Order</Button>
              <Button variant="secondary" onClick={() => updateOrderStatus(order.id, 'preparing', 'pending')}>Mark Preparing</Button>
              <Button variant="secondary" onClick={() => updateOrderStatus(order.id, 'packed', 'packed')}>Mark Packed</Button>
              <Button variant="ghost" onClick={() => navigate(`/shipments/new/${order.id}`)}>Create Shipment</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

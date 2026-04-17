import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table } from '../../components/ui/Table';
import { Textarea } from '../../components/ui/Textarea';
import { useAppContext } from '../../app/AppProvider';

export function ShipmentsPage() {
  const { shipments } = useAppContext();
  const navigate = useNavigate();
  const [carrier, setCarrier] = useState('all');
  const [status, setStatus] = useState('all');
  const [risk, setRisk] = useState('all');

  const carriers = Array.from(new Set(shipments.map((shipment) => shipment.carrier)));
  const filtered = useMemo(
    () =>
      shipments.filter((shipment) => {
        const matchesCarrier = carrier === 'all' || shipment.carrier === carrier;
        const matchesStatus = status === 'all' || shipment.status === status;
        const matchesRisk =
          risk === 'all' || (risk === 'risk' && shipment.slaRisk) || (risk === 'delayed' && shipment.delayed) || (risk === 'healthy' && !shipment.slaRisk);
        return matchesCarrier && matchesStatus && matchesRisk;
      }),
    [shipments, carrier, status, risk],
  );

  return (
    <div className="page-grid">
      <PageHeader title="Shipments" subtitle="Create, monitor, and update vendor-managed shipments." actionLabel="New Shipment" onAction={() => navigate('/shipments/new')} />
      <Card>
        <CardHeader title="Filters" />
        <div className="filters">
          <Select value={carrier} onChange={(event) => setCarrier(event.target.value)}>
            <option value="all">All carriers</option>
            {carriers.map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            {['pending', 'packed', 'handed_to_carrier', 'in_transit', 'delivered', 'failed_delivery', 'returned'].map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Select value={risk} onChange={(event) => setRisk(event.target.value)}>
            <option value="all">All SLA states</option>
            <option value="risk">SLA risk</option>
            <option value="delayed">Delayed</option>
            <option value="healthy">Healthy</option>
          </Select>
        </div>
      </Card>
      <Card>
        <Table columns={['Shipment Number', 'Related Order', 'Carrier', 'Tracking Number', 'Status', 'Ship-by Date', 'Estimated Delivery', 'Actions']}>
          {filtered.map((shipment) => (
            <tr key={shipment.id} className={shipment.delayed || shipment.slaRisk ? 'row-warning' : ''}>
              <td>{shipment.shipmentNumber}</td>
              <td>{shipment.orderNumber}</td>
              <td>{shipment.carrier}</td>
              <td>{shipment.trackingNumber}</td>
              <td><Badge label={shipment.status} tone={shipment.delayed ? 'danger' : shipment.slaRisk ? 'warning' : 'info'} /></td>
              <td>{shipment.shipByDate}</td>
              <td>{shipment.estimatedDelivery}</td>
              <td><Button variant="ghost" onClick={() => navigate(`/shipments/${shipment.id}`)}>View</Button></td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

export function ShipmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shipments, updateShipmentStatus } = useAppContext();
  const shipment = shipments.find((item) => item.id === id);

  if (!shipment) return <div>Shipment not found.</div>;

  return (
    <div className="page-grid">
      <PageHeader title={shipment.shipmentNumber} subtitle={`Order ${shipment.orderNumber}`} actionLabel="Back to Shipments" onAction={() => navigate('/shipments')} />
      <Card>
        <CardHeader title="Shipment Detail" />
        <div className="form-grid">
          <div className="field"><span>Carrier</span><strong>{shipment.carrier}</strong></div>
          <div className="field"><span>Tracking Number</span><strong>{shipment.trackingNumber}</strong></div>
          <div className="field"><span>Ship-by Date</span><strong>{shipment.shipByDate}</strong></div>
          <div className="field"><span>Estimated Delivery</span><strong>{shipment.estimatedDelivery}</strong></div>
          <div className="field field-full"><span>Note</span><p>{shipment.note}</p></div>
        </div>
        <div className="inline-row">
          {['pending', 'packed', 'handed_to_carrier', 'in_transit', 'delivered', 'failed_delivery', 'returned'].map((item) => (
            <Button key={item} variant="secondary" onClick={() => updateShipmentStatus(shipment.id, item as typeof shipment.status)}>
              Mark {item}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function ShipmentCreatePage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, settings, createShipment } = useAppContext();
  const order = orders.find((item) => item.id === orderId) ?? orders[0];
  const [carrier, setCarrier] = useState(settings.defaultCarrier);
  const [trackingNumber, setTrackingNumber] = useState(`TRK-${Date.now().toString().slice(-6)}`);
  const [estimatedDelivery, setEstimatedDelivery] = useState('2026-04-15');
  const [note, setNote] = useState(settings.defaultPreparationNote);

  return (
    <div className="page-grid">
      <PageHeader title="Create Shipment" subtitle={`Link shipment to order ${order.orderNumber}`} actionLabel="Back to Shipments" onAction={() => navigate('/shipments')} />
      <Card>
        <CardHeader title="Shipment Form" />
        <div className="form-grid">
          <label className="field"><span>Carrier</span><Input value={carrier} onChange={(event) => setCarrier(event.target.value)} /></label>
          <label className="field"><span>Tracking number</span><Input value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} /></label>
          <label className="field"><span>Estimated delivery date</span><Input type="date" value={estimatedDelivery} onChange={(event) => setEstimatedDelivery(event.target.value)} /></label>
          <label className="field"><span>Ship-by date</span><Input type="date" value="2026-04-14" readOnly /></label>
          <label className="field field-full"><span>Note</span><Textarea rows={4} value={note} onChange={(event) => setNote(event.target.value)} /></label>
        </div>
        <Button
          onClick={() => {
            createShipment({
              orderId: order.id,
              orderNumber: order.orderNumber,
              carrier,
              trackingNumber,
              status: 'pending',
              shipByDate: '2026-04-14',
              estimatedDelivery,
              delayed: false,
              slaRisk: false,
              note,
            });
            navigate('/shipments');
          }}
        >
          Create Shipment
        </Button>
      </Card>
    </div>
  );
}

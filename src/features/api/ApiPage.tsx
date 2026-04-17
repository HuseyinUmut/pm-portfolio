import { useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { useAppContext } from '../../app/AppProvider';

export function ApiPage() {
  const { apiKeys, webhooks, createApiKey, revokeApiKey } = useAppContext();
  const [name, setName] = useState('');

  return (
    <div className="page-grid">
      <PageHeader title="API & Integrations" subtitle="Manage keys, webhooks, and supported integration surfaces." />
      <div className="stats-grid">
        {['Products', 'Stock', 'Prices', 'Orders', 'Shipments'].map((group) => (
          <Card key={group} className="stat-card"><span>Endpoint Group</span><strong>{group}</strong><small>Supported</small></Card>
        ))}
      </div>
      <div className="two-col">
        <Card>
          <CardHeader title="API Keys" subtitle="Create and revoke integration credentials" />
          <div className="inline-row">
            <Input placeholder="New API key name" value={name} onChange={(event) => setName(event.target.value)} />
            <Button onClick={() => { createApiKey(name || 'New Integration'); setName(''); }}>Create New API Key</Button>
          </div>
          <Table columns={['Name', 'Key', 'Created', 'Last Used', 'Status', 'Action']}>
            {apiKeys.map((key) => (
              <tr key={key.id}>
                <td>{key.name}</td>
                <td>{key.keyPreview}</td>
                <td>{key.createdAt}</td>
                <td>{key.lastUsed}</td>
                <td><Badge label={key.status} tone={key.status === 'active' ? 'success' : 'danger'} /></td>
                <td>{key.status === 'active' ? <Button variant="danger" onClick={() => revokeApiKey(key.id)}>Revoke</Button> : null}</td>
              </tr>
            ))}
          </Table>
        </Card>
        <Card>
          <CardHeader title="Webhook List" subtitle="Sample subscription endpoints" />
          <Table columns={['Event', 'URL', 'Status']}>
            {webhooks.map((hook) => (
              <tr key={hook.id}>
                <td>{hook.event}</td>
                <td>{hook.url}</td>
                <td><Badge label={hook.status} tone={hook.status === 'active' ? 'success' : 'danger'} /></td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
      <div className="two-col">
        <Card>
          <CardHeader title="Integration Status" />
          <div className="stack">
            <div className="list-item"><span>ERP Connector</span><Badge label="Connected" tone="success" /></div>
            <div className="list-item"><span>Warehouse Sync</span><Badge label="Healthy" tone="success" /></div>
            <div className="list-item"><span>Webhook Delivery</span><Badge label="1 failing endpoint" tone="warning" /></div>
          </div>
        </Card>
        <Card>
          <CardHeader title="API Documentation" subtitle="Mock overview for internal demo" />
          <div className="stack">
            <p>Base URL: `https://api.marketplace.local/vendor`</p>
            <p>Webhook events: new order, order cancelled, shipment delayed, payout created</p>
            <Button variant="secondary">Open Documentation</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

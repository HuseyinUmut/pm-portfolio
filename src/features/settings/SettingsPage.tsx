import { useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { useAppContext } from '../../app/AppProvider';

export function SettingsPage() {
  const { settings, currentVendor, saveSettings } = useAppContext();
  const [form, setForm] = useState(settings);

  return (
    <div className="page-grid">
      <PageHeader title="Settings" subtitle="Notification preferences, shipping defaults, user management, and company preferences." actionLabel="Save Settings" onAction={() => saveSettings(form)} />
      <div className="two-col">
        <Card>
          <CardHeader title="Notification Preferences" />
          <div className="stack">
            <label className="checkbox"><input type="checkbox" checked={form.emailNotifications} onChange={(event) => setForm({ ...form, emailNotifications: event.target.checked })} /> Email notifications</label>
            <label className="checkbox"><input type="checkbox" checked={form.smsNotifications} onChange={(event) => setForm({ ...form, smsNotifications: event.target.checked })} /> SMS notifications</label>
          </div>
        </Card>
        <Card>
          <CardHeader title="Shipping Defaults" />
          <div className="stack">
            <label className="field"><span>Default carrier</span><Input value={form.defaultCarrier} onChange={(event) => setForm({ ...form, defaultCarrier: event.target.value })} /></label>
            <label className="checkbox"><input type="checkbox" checked={form.autoCreateShipmentDraft} onChange={(event) => setForm({ ...form, autoCreateShipmentDraft: event.target.checked })} /> Auto create shipment draft after packing</label>
            <label className="field"><span>Preparation note</span><Textarea rows={3} value={form.defaultPreparationNote} onChange={(event) => setForm({ ...form, defaultPreparationNote: event.target.value })} /></label>
          </div>
        </Card>
      </div>
      <div className="two-col">
        <Card>
          <CardHeader title="API Settings Summary" />
          <div className="stack">
            <div className="list-item"><span>Active keys</span><strong>2</strong></div>
            <div className="list-item"><span>Webhook mode</span><strong>Signed delivery enabled</strong></div>
            <div className="list-item"><span>Language</span><Select value={form.companyLanguage} onChange={(event) => setForm({ ...form, companyLanguage: event.target.value })}><option>English</option><option>Turkish</option></Select></div>
          </div>
        </Card>
        <Card>
          <CardHeader title="User Management" />
          <div className="stack">
            {currentVendor?.users.map((user) => (
              <div className="list-item" key={user.id}>
                <span>{user.name}</span>
                <strong>{user.role}</strong>
              </div>
            ))}
            <Button variant="secondary">Manage Users</Button>
          </div>
        </Card>
      </div>
      <Card>
        <CardHeader title="Company Preferences" />
        <div className="stack">
          <div className="list-item"><span>Brand display name</span><strong>{currentVendor?.name}</strong></div>
          <div className="list-item"><span>Payout cycle</span><strong>{currentVendor?.payoutCycle}</strong></div>
          <div className="list-item"><span>Shipping responsibility</span><strong>{currentVendor?.shippingResponsibility}</strong></div>
        </div>
      </Card>
    </div>
  );
}

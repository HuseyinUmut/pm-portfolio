import { useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAppContext } from '../../app/AppProvider';

export function CompanyPage() {
  const { currentVendor, saveVendorProfile } = useAppContext();
  const [form, setForm] = useState(currentVendor!);

  return (
    <div className="page-grid">
      <PageHeader title="Company Profile" subtitle="Maintain legal, finance, and operations account details." actionLabel="Save Profile" onAction={() => saveVendorProfile(form)} />
      <div className="two-col">
        <Card>
          <CardHeader title="Company Information" />
          <div className="form-grid">
            <label className="field">
              <span>Legal name</span>
              <Input value={form.legalName} onChange={(event) => setForm({ ...form, legalName: event.target.value })} />
            </label>
            <label className="field">
              <span>Tax number</span>
              <Input value={form.taxNumber} onChange={(event) => setForm({ ...form, taxNumber: event.target.value })} />
            </label>
            <label className="field field-full">
              <span>Billing address</span>
              <Textarea rows={3} value={form.billingAddress} onChange={(event) => setForm({ ...form, billingAddress: event.target.value })} />
            </label>
            <label className="field">
              <span>Bank</span>
              <Input value={form.bankName} onChange={(event) => setForm({ ...form, bankName: event.target.value })} />
            </label>
            <label className="field">
              <span>IBAN</span>
              <Input value={form.iban} onChange={(event) => setForm({ ...form, iban: event.target.value })} />
            </label>
          </div>
        </Card>
        <Card>
          <CardHeader title="Commercial Terms" />
          <div className="stack">
            <div className="list-item"><span>Contract status</span><Badge label={form.contractAccepted ? 'Accepted' : 'Pending'} tone={form.contractAccepted ? 'success' : 'warning'} /></div>
            <div className="list-item"><span>Commission rate</span><strong>{form.commissionRate}%</strong></div>
            <div className="list-item"><span>Payout cycle</span><strong>{form.payoutCycle}</strong></div>
            <div className="list-item"><span>Shipping responsibility</span><strong>{form.shippingResponsibility}</strong></div>
          </div>
        </Card>
      </div>
      <Card>
        <CardHeader title="Contact Persons" />
        <div className="stack">
          {form.contacts.map((contact) => (
            <div className="list-item" key={contact.email}>
              <div>
                <strong>{contact.name}</strong>
                <p>{contact.title}</p>
              </div>
              <div>
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <CardHeader title="Users & Roles" action={<Button variant="secondary">Invite User</Button>} />
        <Table columns={['Name', 'Email', 'Role', 'Status']}>
          {form.users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><Badge label={user.role} tone="info" /></td>
              <td><Badge label={user.status} tone={user.status === 'active' ? 'success' : 'warning'} /></td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { useAppContext } from './AppProvider';

export function LoginPage() {
  const { vendors, login } = useAppContext();
  const [vendorId, setVendorId] = useState(vendors[0]?.id ?? '');

  return (
    <div className="login-page">
      <Card className="login-card">
        <div className="login-copy">
          <span className="eyebrow">Grocery Marketplace</span>
          <h1>Vendor Panel Prototype</h1>
          <p>Use a fake vendor account to demo products, orders, shipments, finance, support, and integrations.</p>
        </div>
        <label className="field">
          <span>Vendor account</span>
          <Select value={vendorId} onChange={(event) => setVendorId(event.target.value)}>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </Select>
        </label>
        <Button fullWidth onClick={() => login(vendorId)}>
          Fake Vendor Login
        </Button>
      </Card>
    </div>
  );
}

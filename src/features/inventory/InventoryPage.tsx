import { useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { useAppContext } from '../../app/AppProvider';

export function InventoryPage() {
  const { products, updateStock } = useAppContext();
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? '');
  const selected = products.find((product) => product.id === selectedId) ?? products[0];

  return (
    <div className="page-grid">
      <PageHeader title="Inventory" subtitle="Adjust stock, thresholds, and review recent stock movement context." />
      <div className="two-col">
        <Card>
          <CardHeader title="Stock Table" />
          <Table columns={['SKU', 'Product', 'Reserved', 'Sellable', 'Low Stock Threshold', 'Action']}>
            {products.map((product) => (
              <tr key={product.id} className={product.stock <= product.lowStockThreshold ? 'row-warning' : ''}>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.reservedStock}</td>
                <td>{Math.max(0, product.stock - product.reservedStock)}</td>
                <td>{product.lowStockThreshold}</td>
                <td>
                  <div className="inline-row">
                    <Input type="number" value={product.stock} onChange={(event) => updateStock(product.id, Number(event.target.value))} />
                    <Button variant="ghost" onClick={() => setSelectedId(product.id)}>History</Button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
        <Card>
          <CardHeader title="Movement History" subtitle={selected ? `${selected.name} (${selected.sku})` : undefined} />
          {selected ? (
            <div className="stack">
              <div className="list-item"><span>Current stock</span><strong>{selected.stock}</strong></div>
              <div className="list-item"><span>Reserved stock</span><strong>{selected.reservedStock}</strong></div>
              <div className="list-item"><span>Sellable stock</span><strong>{Math.max(0, selected.stock - selected.reservedStock)}</strong></div>
              <div className="list-item"><span>Low stock threshold</span><Input type="number" value={selected.lowStockThreshold} onChange={(event) => updateStock(selected.id, selected.stock, Number(event.target.value))} /></div>
              <Badge label={selected.stock <= selected.lowStockThreshold ? 'Low stock warning' : 'Stock healthy'} tone={selected.stock <= selected.lowStockThreshold ? 'danger' : 'success'} />
              <div className="timeline">
                <div className="timeline-item"><strong>Inbound stock +20</strong><p>Warehouse adjustment · 2026-04-12 17:05</p></div>
                <div className="timeline-item"><strong>Reserved -3</strong><p>Orders allocated · 2026-04-12 14:40</p></div>
                <div className="timeline-item"><strong>Manual correction -1</strong><p>Damaged item removed · 2026-04-11 09:15</p></div>
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}

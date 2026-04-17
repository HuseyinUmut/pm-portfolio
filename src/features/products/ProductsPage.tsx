import { useMemo, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Drawer } from '../../components/ui/Drawer';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Table } from '../../components/ui/Table';
import { Textarea } from '../../components/ui/Textarea';
import { useAppContext } from '../../app/AppProvider';
import type { Product, ProductStatus } from '../../mock/types';

const emptyProduct: Product = {
  id: 'new-product',
  sku: '',
  barcode: '',
  name: '',
  category: 'Fruits',
  brand: '',
  description: '',
  price: 0,
  vat: 1,
  stock: 0,
  reservedStock: 0,
  lowStockThreshold: 5,
  imageUrl: '',
  status: 'draft',
  catalogStatus: 'matched',
};

export function ProductsPage() {
  const { products, saveProduct, updateProductStatus } = useAppContext();
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [editing, setEditing] = useState<Product | null>(null);
  const [viewing, setViewing] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'low' && product.stock <= product.lowStockThreshold) ||
        (stockFilter === 'out' && product.stock === 0) ||
        (stockFilter === 'healthy' && product.stock > product.lowStockThreshold);
      return matchesStatus && matchesCategory && matchesStock;
    });
  }, [products, statusFilter, categoryFilter, stockFilter]);

  const categories = Array.from(new Set(products.map((product) => product.category)));

  const handleSave = () => {
    if (!editing) return;
    const product = editing.id.startsWith('new-') ? { ...editing, id: `prod-${Date.now()}` } : editing;
    saveProduct(product);
    setEditing(null);
  };

  return (
    <div className="page-grid">
      <PageHeader title="Products" subtitle="Manage vendor catalog, listings, and catalog matching." actionLabel="Add Product" onAction={() => setEditing({ ...emptyProduct, id: `new-${Date.now()}` })} />
      <Card>
        <CardHeader title="Filters" />
        <div className="filters">
          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            {['draft', 'in_review', 'active', 'rejected', 'inactive'].map((status) => <option key={status} value={status}>{status}</option>)}
          </Select>
          <Select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </Select>
          <Select value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}>
            <option value="all">All stock levels</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
            <option value="healthy">Healthy stock</option>
          </Select>
        </div>
      </Card>
      <Card>
        <Table columns={['SKU', 'Barcode', 'Product Name', 'Category', 'Brand', 'Price', 'VAT', 'Stock', 'Status', 'Actions']}>
          {filtered.map((product) => (
            <tr key={product.id}>
              <td>{product.sku}</td>
              <td>{product.barcode}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>TRY {product.price.toFixed(2)}</td>
              <td>{product.vat}%</td>
              <td className={product.stock <= product.lowStockThreshold ? 'text-danger' : ''}>{product.stock}</td>
              <td><Badge label={product.status} tone={product.status === 'active' ? 'success' : product.status === 'rejected' ? 'danger' : 'warning'} /></td>
              <td>
                <div className="inline-row">
                  <Button variant="ghost" onClick={() => setViewing(product)}>View</Button>
                  <Button variant="ghost" onClick={() => setEditing(product)}>Edit</Button>
                  {product.status === 'active' ? (
                    <Button variant="secondary" onClick={() => updateProductStatus(product.id, 'inactive')}>Deactivate</Button>
                  ) : (
                    <Button variant="secondary" onClick={() => updateProductStatus(product.id, 'active' as ProductStatus)}>Activate</Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
      <Modal open={Boolean(editing)} title={editing?.id.startsWith('new-') ? 'Add Product' : 'Edit Product'} onClose={() => setEditing(null)}>
        {editing ? (
          <div className="stack">
            <div className="form-grid">
              <label className="field"><span>SKU</span><Input value={editing.sku} onChange={(event) => setEditing({ ...editing, sku: event.target.value })} /></label>
              <label className="field"><span>Barcode</span><Input value={editing.barcode} onChange={(event) => setEditing({ ...editing, barcode: event.target.value })} /></label>
              <label className="field field-full"><span>Product name</span><Input value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} /></label>
              <label className="field"><span>Category</span><Input value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value })} /></label>
              <label className="field"><span>Brand</span><Input value={editing.brand} onChange={(event) => setEditing({ ...editing, brand: event.target.value })} /></label>
              <label className="field field-full"><span>Description</span><Textarea rows={3} value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} /></label>
              <label className="field"><span>Price</span><Input type="number" value={editing.price} onChange={(event) => setEditing({ ...editing, price: Number(event.target.value) })} /></label>
              <label className="field"><span>VAT</span><Input type="number" value={editing.vat} onChange={(event) => setEditing({ ...editing, vat: Number(event.target.value) })} /></label>
              <label className="field"><span>Stock</span><Input type="number" value={editing.stock} onChange={(event) => setEditing({ ...editing, stock: Number(event.target.value) })} /></label>
              <label className="field"><span>Image URL</span><Input value={editing.imageUrl} onChange={(event) => setEditing({ ...editing, imageUrl: event.target.value })} /></label>
              <label className="field"><span>Status</span><Select value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value as ProductStatus })}>{['draft', 'in_review', 'active', 'rejected', 'inactive'].map((status) => <option key={status} value={status}>{status}</option>)}</Select></label>
              <label className="field"><span>Catalog matching</span><Select value={editing.catalogStatus} onChange={(event) => setEditing({ ...editing, catalogStatus: event.target.value as Product['catalogStatus'] })}><option value="matched">Matched to existing catalog item</option><option value="new_review">Submitted for new catalog review</option></Select></label>
            </div>
            <Button onClick={handleSave}>Save Product</Button>
          </div>
        ) : null}
      </Modal>
      <Drawer open={Boolean(viewing)} title={viewing?.name ?? 'Product'} onClose={() => setViewing(null)}>
        {viewing ? (
          <div className="stack">
            <img src={viewing.imageUrl} alt={viewing.name} className="product-image" />
            <div className="list-item"><span>SKU</span><strong>{viewing.sku}</strong></div>
            <div className="list-item"><span>Catalog</span><Badge label={viewing.catalogStatus === 'matched' ? 'Matched to existing catalog item' : 'Submitted for new catalog review'} tone="info" /></div>
            <div className="list-item"><span>Status</span><Badge label={viewing.status} tone="warning" /></div>
            <p>{viewing.description}</p>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

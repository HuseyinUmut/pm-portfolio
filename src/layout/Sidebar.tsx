import { NavLink } from 'react-router-dom';

const navItems = [
  ['/', 'Dashboard'],
  ['/company', 'Company Profile'],
  ['/products', 'Products'],
  ['/inventory', 'Inventory'],
  ['/bulk-upload', 'Bulk Upload'],
  ['/api', 'API & Integrations'],
  ['/orders', 'Orders'],
  ['/shipments', 'Shipments'],
  ['/finance', 'Finance'],
  ['/announcements', 'Announcements'],
  ['/tickets', 'Support Tickets'],
  ['/settings', 'Settings'],
] as const;

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <strong>Vendor Panel</strong>
        <span>Marketplace MVP</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(([path, label]) => (
          <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

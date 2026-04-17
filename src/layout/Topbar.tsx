import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAppContext } from '../app/AppProvider';

export function Topbar() {
  const { currentVendor, logout } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div>
        <strong>{location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1).replace('-', ' ')}</strong>
        <p>{currentVendor?.name}</p>
      </div>
      <div className="topbar-actions">
        <Button variant="secondary" onClick={() => navigate('/announcements')}>
          Announcements
        </Button>
        <Button variant="ghost" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}

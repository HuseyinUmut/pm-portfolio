import { AppProvider, useAppContext } from './AppProvider';
import { AppRoutes } from '../routes';
import { ToastViewport } from '../components/ui/Toast';

function AppBody() {
  const { toasts } = useAppContext();
  return (
    <>
      <AppRoutes />
      <ToastViewport items={toasts} />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppBody />
    </AppProvider>
  );
}

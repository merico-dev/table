import { Notifications } from '@mantine/notifications';
import { Navigate, Outlet } from 'react-router-dom';
import { DashboardStoreProvider } from '../app/models/dashboard-store-context';
import { useAccountContext } from '../require-auth/account-context';

export function DashboardEditorFrame() {
  const { canEdit } = useAccountContext();
  if (!canEdit) {
    return <Navigate to="/" replace />;
  }
  return (
    <DashboardStoreProvider>
      <Notifications position="top-right" />
      <Outlet />
    </DashboardStoreProvider>
  );
}

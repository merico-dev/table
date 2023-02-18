import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { Navigate, Outlet } from 'react-router-dom';
import { useAccountContext } from '../require-auth/account-context';

export function DashboardEditorFrame() {
  const { canEdit } = useAccountContext();
  if (!canEdit) {
    return <Navigate to="/" replace />;
  }
  return (
    <div>
      <MantineProvider>
        <NotificationsProvider>
          <Outlet />
        </NotificationsProvider>
      </MantineProvider>
    </div>
  );
}

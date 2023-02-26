import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
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
      <MantineProvider
        theme={{
          breakpoints: {
            xs: 1366,
            sm: 1440,
            md: 1536,
            lg: 1600,
            xl: 1920,
          },
        }}
      >
        <NotificationsProvider position="top-right">
          <Outlet />
        </NotificationsProvider>
      </MantineProvider>
    </DashboardStoreProvider>
  );
}

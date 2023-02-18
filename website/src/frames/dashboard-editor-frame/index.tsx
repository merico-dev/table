import { AppShell, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { Navigate, Outlet } from 'react-router-dom';
import { useAccountContext } from '../require-auth/account-context';

export function DashboardEditorFrame() {
  const { canEdit } = useAccountContext();
  if (!canEdit) {
    return <Navigate to="/" replace />;
  }
  return (
    <AppShell
      padding="md"
      styles={{
        root: {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
        body: {
          flexGrow: 1,
        },
        main: {
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <MantineProvider>
        <NotificationsProvider>
          <Outlet />
        </NotificationsProvider>
      </MantineProvider>
    </AppShell>
  );
}

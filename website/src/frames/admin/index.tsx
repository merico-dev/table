import { AppShell, MantineProvider } from '@mantine/core';
import { AdminHeader } from './header';
import { Notifications } from '@mantine/notifications';
import { Navigate, Outlet } from 'react-router-dom';
import { AdminNavbar } from './navbar';
import './index.css';
import { useAccountContext } from '../require-auth/account-context';

export function AdminFrame() {
  const { isAdmin } = useAccountContext();
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return (
    <AppShell
      padding="md"
      header={<AdminHeader />}
      navbar={<AdminNavbar />}
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
        <Notifications position="top-right">
          <Outlet />
        </Notifications>
      </MantineProvider>
    </AppShell>
  );
}

import { AppShell, MantineProvider } from '@mantine/core';
import { AdminHeader } from './header';
import { NotificationsProvider } from '@mantine/notifications';
import { Outlet } from 'react-router-dom';
import { AdminNavbar } from './navbar';
import './index.css';

export function AdminFrame() {
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
        <NotificationsProvider>
          <Outlet />
        </NotificationsProvider>
      </MantineProvider>
    </AppShell>
  );
}

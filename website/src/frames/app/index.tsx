import { AppShell, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { Outlet } from 'react-router-dom';
import { Header } from './header';
import './index.css';
import { DashboardStoreProvider } from './models/dashboard-store-context';
import { Navbar } from './navbar';

export function App() {
  return (
    <DashboardStoreProvider>
      <AppShell
        className="website-app"
        padding="md"
        header={<Header />}
        navbar={<Navbar />}
        styles={{
          main: {
            height: 'calc(100vh - 60px)',
            overflow: 'scroll',
          },
        }}
      >
        <MantineProvider>
          <NotificationsProvider>
            <Outlet />
          </NotificationsProvider>
        </MantineProvider>
      </AppShell>
    </DashboardStoreProvider>
  );
}

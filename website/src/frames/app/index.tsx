import { AppShell, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
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
            paddingTop: 'calc(var(--mantine-header-height, 0px) + 16px)',
            paddingRight: 0,
            paddingLeft: 'calc(var(--mantine-navbar-width, 0px) + 4px)',
            paddingBottom: 'calc(var(--mantine-footer-height, 0px) + 10px)',
          },
        }}
      >
        <MantineProvider>
          <Notifications position="top-right" />
          <Outlet />
        </MantineProvider>
      </AppShell>
    </DashboardStoreProvider>
  );
}

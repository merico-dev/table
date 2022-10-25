import { AppShell, MantineProvider } from '@mantine/core';
import { Header } from './header';
import { NotificationsProvider } from '@mantine/notifications';
import { Outlet } from 'react-router-dom';
import './index.css';
import { Navbar } from './navbar';

export function App() {
  return (
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
  );
}

import { AppShell, MantineProvider } from '@mantine/core';
import { Header } from './header';
import { NotificationsProvider } from '@mantine/notifications';
import { Outlet } from 'react-router-dom';
import '@devtable/dashboard/dist/style.css';
import './index.css'
import { Navbar } from './navbar';

export function App() {
  return (
    <AppShell
      padding="md"
      header={<Header />}
      navbar={<Navbar />}
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
        }
      }}
    >
      <MantineProvider>
        <NotificationsProvider>
          <Outlet />
        </NotificationsProvider>
      </MantineProvider>
    </AppShell>
  )
}

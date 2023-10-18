import { AppShell, Box, Group, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useBoolean } from 'ahooks';
import { Outlet } from 'react-router-dom';
import { AccountDropdown } from '../../components/account-dropdown';
import './index.css';
import { DashboardStoreProvider } from './models/dashboard-store-context';
import { Navbar } from './navbar';
import { NavbarToggler } from './navbar-toggler';
import { DashboardBreadcrumbs } from './breadcrumbs';

export function App() {
  const [navbarCollapsed, { setTrue, setFalse }] = useBoolean(false);
  return (
    <DashboardStoreProvider>
      <AppShell
        className="website-app"
        padding="md"
        navbar={<Navbar collapse={setTrue} />}
        styles={{
          main: {
            height: '100vh',
            overflow: 'hidden',
            padding: 0,
            paddingRight: 0,
            paddingBottom: 'calc(var(--mantine-footer-height, 0px) + 10px)',
            paddingLeft: 'calc(var(--mantine-navbar-width, 0px) + 0px)',
            width: '100vw',
            transition: 'padding-left ease 100ms',
          },
        }}
        sx={{
          '--mantine-navbar-width': navbarCollapsed ? '0px' : '300px',
          '.mantine-Navbar-root': {
            maxWidth: navbarCollapsed ? 0 : '100%',
            opacity: navbarCollapsed ? 0 : 1,
            transition: 'max-width, opacity ease 100ms',
          },
        }}
      >
        <MantineProvider>
          <Group position="apart" px={10} sx={{ height: '40px', borderBottom: '0.0625rem solid #e9ecef' }}>
            <Group position="left">
              <NavbarToggler collapsed={navbarCollapsed} expand={setFalse} />
              <DashboardBreadcrumbs />
            </Group>
            <AccountDropdown height={39} />
          </Group>
          <Box sx={{ height: 'calc(100vh - 30px)', overflow: 'auto' }}>
            <Notifications position="top-right" />
            <Outlet />
          </Box>
        </MantineProvider>
      </AppShell>
    </DashboardStoreProvider>
  );
}

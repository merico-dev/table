import { AppShell, Box, Group, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Navigate, Outlet } from 'react-router-dom';
import { AccountDropdown } from '../../components/account-dropdown';
import { useAccountContext } from '../require-auth/account-context';
import './index.css';
import { AdminNavbar } from './navbar';
import { AdminBreadcrumbs } from './breadcrumbs';

export function AdminFrame() {
  const { isAdmin } = useAccountContext();
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return (
    <AppShell
      padding="md"
      navbar={<AdminNavbar />}
      styles={{
        main: {
          height: '100vh',
          overflow: 'hidden',
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 'calc(var(--mantine-footer-height, 0px) + 10px)',
          paddingLeft: 'calc(var(--mantine-navbar-width, 0px) + 0px)',
          width: '100vw',
          transition: 'padding-left ease 100ms',
        },
      }}
    >
      <MantineProvider>
        <Group position="apart" pl={10} sx={{ height: '40px', borderBottom: '0.0625rem solid #e9ecef' }}>
          <Group position="left">
            {/* should place breadcrumbs here */}
            <AdminBreadcrumbs />
          </Group>
          <AccountDropdown height={39} />
        </Group>
        <Box p={10} sx={{ height: 'calc(100vh - 30px)', overflow: 'auto' }}>
          <Notifications position="top-right" />
          <Outlet />
        </Box>
      </MantineProvider>
    </AppShell>
  );
}

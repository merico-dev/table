import { AppShell, Box, Group } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useBoolean } from 'ahooks';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AccountDropdown } from '../../components/account-dropdown';
import { LanguageSwitcher } from '../../components/language-switcher';
import { DashboardBreadcrumbs } from './breadcrumbs';
import './index.css';
import { DashboardStoreProvider } from './models/dashboard-store-context';
import { Navbar } from './navbar';
import { NavbarToggler } from './navbar-toggler';

export function App() {
  const [navbarCollapsed, { setTrue, setFalse }] = useBoolean(false);
  useEffect(() => {
    // force react-grid-layout to re-render
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }, [navbarCollapsed]);

  return (
    <DashboardStoreProvider>
      <AppShell
        className="website-app"
        padding="md"
        navbar={{
          width: { base: 300 },
          breakpoint: 'xxs',
        }}
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
        <Navbar collapse={setTrue} />
        <AppShell.Main>
          <Group justify="apart" pl={10} sx={{ height: '40px', borderBottom: '0.0625rem solid #e9ecef' }}>
            <Group justify="left">
              <NavbarToggler collapsed={navbarCollapsed} expand={setFalse} />
              <DashboardBreadcrumbs />
            </Group>
            <Group justify="right" gap={2}>
              <LanguageSwitcher />
              <AccountDropdown height={39} />
            </Group>
          </Group>
          <Box sx={{ height: 'calc(100vh - 30px)', overflow: 'auto' }}>
            <Notifications position="top-right" />
            <Outlet />
          </Box>
        </AppShell.Main>
      </AppShell>
    </DashboardStoreProvider>
  );
}

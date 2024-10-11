import { AppShell } from '@mantine/core';
import { AdminPageLinks } from './admin-page-links';
import { AdminSystemNavActions } from './admin-system-nav-actions';

export function AdminNavbar() {
  return (
    <AppShell.Navbar sx={{ overflow: 'hidden' }}>
      <AdminSystemNavActions />

      <AppShell.Section grow>
        <AdminPageLinks />
      </AppShell.Section>
    </AppShell.Navbar>
  );
}

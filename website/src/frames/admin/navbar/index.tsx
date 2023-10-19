import { Navbar as MantineNavbar } from '@mantine/core';
import { AdminPageLinks } from './admin-page-links';
import { AdminSystemNavActions } from './admin-system-nav-actions';

export function AdminNavbar() {
  return (
    <MantineNavbar width={{ base: 300 }} height="100vh" sx={{ overflow: 'hidden' }}>
      <AdminSystemNavActions />

      <MantineNavbar.Section grow>
        <AdminPageLinks />
      </MantineNavbar.Section>
    </MantineNavbar>
  );
}

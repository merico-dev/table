import { Box, Navbar as MantineNavbar } from '@mantine/core';
import { DashboardLinks } from './dashboard-links';
import { DashboardNavActions } from './dashboard-nav-actions';
import { SystemNavActions } from './system-nav-actions';

export function Navbar({ collapse }: { collapse: () => void }) {
  return (
    <MantineNavbar width={{ base: 300 }} height="100vh" sx={{ overflow: 'hidden' }}>
      <SystemNavActions collapse={collapse} />
      <DashboardNavActions />
      <MantineNavbar.Section grow sx={{ overflow: 'hidden' }} pl="xs" pr={0}>
        <Box sx={{ height: '100%', overflow: 'auto' }}>
          <DashboardLinks />
        </Box>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
}

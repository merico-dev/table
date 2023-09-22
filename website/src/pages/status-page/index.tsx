import { Anchor, Box, Breadcrumbs, Group } from '@mantine/core';
import { Helmet } from 'react-helmet-async';
import { StatusTable } from './table';

const items = [
  { name: 'Settings', to: '/admin' },
  { name: 'Status', to: '/admin/status' },
].map((item) => (
  <Anchor href={item.to} key={item.to}>
    {item.name}
  </Anchor>
));

export function StatusPage() {
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Helmet>
        <title>Status</title>
      </Helmet>
      <Group position="apart" sx={{ width: '100%' }}>
        <Breadcrumbs>{items}</Breadcrumbs>
      </Group>

      <StatusTable />
    </Box>
  );
}

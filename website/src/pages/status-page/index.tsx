import { Anchor, Box, Breadcrumbs, Group } from '@mantine/core';

const items = [
  { name: 'Settings', to: '/admin' },
  { name: 'Status', to: '/admin/status' },
].map((item, index) => (
  <Anchor href={item.to} key={index}>
    {item.name}
  </Anchor>
));

export function StatusPage() {
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Group position="apart" sx={{ width: '100%' }}>
        <Breadcrumbs>{items}</Breadcrumbs>
      </Group>
    </Box>
  );
}

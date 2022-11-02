import { APIKeyList } from '@devtable/settings-form';
import { Anchor, Box, Breadcrumbs, Group } from '@mantine/core';

const items = [
  { name: 'Settings', to: '/admin' },
  { name: 'API Keys', to: '/admin/api_key/list' },
].map((item, index) => (
  <Anchor href={item.to} key={index}>
    {item.name}
  </Anchor>
));

export function APIKeyPage() {
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Group position="apart" sx={{ width: '100%' }}>
        <Breadcrumbs>{items}</Breadcrumbs>
      </Group>
      <APIKeyList config={{ apiBaseURL: import.meta.env.VITE_API_BASE_URL }} />
    </Box>
  );
}

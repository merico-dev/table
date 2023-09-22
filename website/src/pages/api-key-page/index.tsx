import { APIKeyList } from '@devtable/settings-form';
import { Anchor, Box, Breadcrumbs, Group } from '@mantine/core';
import { Helmet } from 'react-helmet-async';
import { SettingsFormConfig } from '../../utils/config';

const items = [
  { name: 'Settings', to: '/admin' },
  { name: 'API Keys', to: '/admin/api_key/list' },
].map((item) => (
  <Anchor href={item.to} key={item.to}>
    {item.name}
  </Anchor>
));

export function APIKeyPage() {
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Helmet>
        <title>API Keys</title>
      </Helmet>
      <Group position="apart" sx={{ width: '100%' }}>
        <Breadcrumbs>{items}</Breadcrumbs>
      </Group>
      <APIKeyList config={SettingsFormConfig} />
    </Box>
  );
}

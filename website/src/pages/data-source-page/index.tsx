import { DataSourceList } from '@devtable/settings-form';
import { Anchor, Box, Breadcrumbs, Group } from '@mantine/core';
import { Helmet } from 'react-helmet-async';
import { SettingsFormConfig } from '../../utils/config';

const items = [
  { name: 'Settings', to: '/admin' },
  { name: 'Data Sources', to: '/admin/data_source/list' },
].map((item, index) => (
  <Anchor href={item.to} key={index}>
    {item.name}
  </Anchor>
));

export function DataSourcePage() {
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Helmet>
        <title>Data Sources</title>
      </Helmet>
      <Group position="apart" sx={{ width: '100%' }}>
        <Breadcrumbs>{items}</Breadcrumbs>
      </Group>
      <DataSourceList config={SettingsFormConfig} />
    </Box>
  );
}

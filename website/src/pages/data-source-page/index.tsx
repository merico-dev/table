import React from 'react';
import { AlertCircle } from 'tabler-icons-react';
import { Box, Breadcrumbs, Anchor, Group, Alert } from '@mantine/core';
import { DataSourceList } from '@devtable/settings-form';

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
      <Group position="apart" sx={{ width: '100%' }}>
        <Breadcrumbs>{items}</Breadcrumbs>
      </Group>
      <Alert mt="md" icon={<AlertCircle size={16} />} title="Editing data sources?" color="gray">
        Details of data sources are not exposed to avoid security risk.
        <br />
        You may only <b>Add</b> or <b>Delete</b> a data source.
      </Alert>
      <DataSourceList config={{ apiBaseURL: import.meta.env.VITE_API_BASE_URL }} />
    </Box>
  );
}

import { SQLSnippetList } from '@devtable/settings-form';
import { Anchor, Box, Breadcrumbs, Group } from '@mantine/core';
import { Helmet } from 'react-helmet-async';
import { SettingsFormConfig } from '../../utils/config';

const items = [
  { name: 'Settings', to: '/admin' },
  { name: 'SQL Snippets', to: '/admin/sql_snippet/list' },
].map((item) => (
  <Anchor href={item.to} key={item.to}>
    {item.name}
  </Anchor>
));

export function SQLSnippetPage() {
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Helmet>
        <title>Data Sources</title>
      </Helmet>
      <Group position="apart" sx={{ width: '100%' }}>
        <Breadcrumbs>{items}</Breadcrumbs>
      </Group>
      <SQLSnippetList config={SettingsFormConfig} />
    </Box>
  );
}

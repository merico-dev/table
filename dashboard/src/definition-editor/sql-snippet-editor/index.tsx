import { Box, Group } from '@mantine/core';
import { GlobalVariablesGuide } from '../../main/dashboard-editor/settings/content/view-global-vars/global-variables-guide';
import { SQLSnippetsEditor } from './editor';

export function EditSQLSnippets() {
  return (
    <Box p={0} sx={{ height: '90vh', maxHeight: 'calc(100vh - 225px)' }}>
      <Group position="apart" grow align="stretch">
        <SQLSnippetsEditor />
        <GlobalVariablesGuide showSQLSnippets={false} />
      </Group>
    </Box>
  );
}

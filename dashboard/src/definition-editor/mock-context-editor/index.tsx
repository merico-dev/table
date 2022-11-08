import { AppShell, Group } from '@mantine/core';
import { GlobalVariablesGuide } from '../global-variables-guide';
import { MockContextEditor } from './editor';

export function EditMockContext() {
  return (
    <AppShell
      sx={{
        height: '90vh',
        maxHeight: 'calc(100vh - 225px)',
        '.mantine-AppShell-body': { height: '100%' },
        main: { height: '100%', width: '100%', padding: 0, margin: 0 },
      }}
      padding="md"
    >
      <Group position="apart" grow align="stretch" noWrap>
        <MockContextEditor />
        <GlobalVariablesGuide showSQLSnippets={false} />
      </Group>
    </AppShell>
  );
}

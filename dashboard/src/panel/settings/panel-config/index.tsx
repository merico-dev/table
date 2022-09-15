import { Box, Group, Stack } from '@mantine/core';
import { EditDescription } from './description';
import { PreviewPanel } from './preview-panel';
import { EditTitle } from './title';

export function PanelConfig() {
  return (
    <Group grow noWrap align="stretch" sx={{ height: '100%' }}>
      <Stack sx={{ width: '40%', flexShrink: 0, flexGrow: 0, height: '100%' }}>
        <EditTitle />
        <EditDescription />
      </Stack>
      <Box sx={{ height: '100%', flexGrow: 1, maxWidth: '60%' }}>
        <PreviewPanel />
      </Box>
    </Group>
  );
}

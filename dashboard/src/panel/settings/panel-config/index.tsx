import { Box, Divider, Group, Stack } from '@mantine/core';
import { EditDescription } from './description';
import { EditStyle } from './edit-style';
import { PreviewPanel } from './preview-panel';
import { EditTitle } from './title';

export function PanelConfig() {
  return (
    <Group grow noWrap align="stretch" sx={{ height: '100%' }}>
      <Stack sx={{ width: '40%', flexShrink: 0, flexGrow: 0, height: '100%' }}>
        <Divider label="Style" labelPosition="center" variant="dashed" />
        <EditStyle />
        <Divider label="Info" labelPosition="center" variant="dashed" />
        <EditTitle />
        <EditDescription />
      </Stack>
      <Box sx={{ height: '100%', flexGrow: 1, maxWidth: '60%' }}>
        <PreviewPanel />
      </Box>
    </Group>
  );
}

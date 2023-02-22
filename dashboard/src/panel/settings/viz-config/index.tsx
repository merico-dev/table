import { Box, Group, Stack } from '@mantine/core';
import { PreviewViz } from './preview-viz';
import { EditVizConf } from './viz-conf';

export function VizConfig() {
  return (
    <Group grow noWrap align="stretch" sx={{ height: '100%', overflow: 'hidden' }}>
      <Stack sx={{ width: '40%', flexShrink: 0, flexGrow: 0, overflow: 'auto', height: '100%' }}>
        <EditVizConf />
      </Stack>
      <Box sx={{ height: '100%', overflow: 'hidden', flexGrow: 1, maxWidth: '60%' }}>
        <PreviewViz />
      </Box>
    </Group>
  );
}

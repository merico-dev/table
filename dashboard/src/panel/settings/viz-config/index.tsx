import { Box, Group, Stack } from "@mantine/core";
import { PreviewViz } from "./preview-viz";
import { EditVizConf } from "./viz-conf";

interface IVizConfig {
}

export function VizConfig({ }: IVizConfig) {
  return (
    <Group grow noWrap align="stretch" sx={{ height: '100%' }}>
      <Stack sx={{ width: '40%', flexShrink: 0, flexGrow: 0 }}>
        <EditVizConf />
      </Stack>
      <Box sx={{ height: '100%', flexGrow: 1, maxWidth: '60%' }}>
        <PreviewViz />
      </Box>
    </Group>
  )
}
import { Box, Group } from "@mantine/core";
import { PreviewViz } from "./preview-viz";
import { EditVizConf } from "./viz-conf";

interface IVizConfig {
}

export function VizConfig({ }: IVizConfig) {
  return (
    <Group direction="row" grow noWrap align="stretch" sx={{ height: '100%' }}>
      <Group grow direction="column" noWrap sx={{ width: '40%', flexShrink: 0, flexGrow: 0 }}>
        <EditVizConf />
      </Group>
      <Box sx={{ height: '100%', flexGrow: 1, maxWidth: '60%' }}>
        <PreviewViz />
      </Box>
    </Group>
  )
}
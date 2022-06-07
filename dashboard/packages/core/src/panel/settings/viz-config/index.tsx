import { Box, Divider, Group } from "@mantine/core";
import { EditDescription } from "./description";
import { PreviewViz } from "./preview-viz";
import { EditTitle } from "./title";
import { EditVizConf } from "./viz-conf";

interface IVizConfig {
}

export function VizConfig({ }: IVizConfig) {
  return (

    <Group direction="row" grow noWrap align="stretch" sx={{ height: '100%' }}>
      <Group grow direction="column" sx={{ width: '40%', flexShrink: 0, flexGrow: 0 }}>
        <EditTitle />
        <EditDescription />
        <Divider sx={{ flexGrow: 0 }} />
        <EditVizConf />
      </Group>
      <Box sx={{ height: '100%', flexGrow: 1, maxWidth: '60%' }}>
        <PreviewViz />
      </Box>
    </Group>
  )
}
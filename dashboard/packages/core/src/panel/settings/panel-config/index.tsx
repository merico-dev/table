import { Box, Group } from "@mantine/core";
import { EditDescription } from "./description";
import { PreviewPanel } from "./preview-panel";
import { EditTitle } from "./title";

interface IPanelConfig {
}

export function PanelConfig({ }: IPanelConfig) {
  return (

    <Group direction="row" grow noWrap align="stretch" sx={{ height: '100%' }}>
      <Group grow direction="column" sx={{ width: '40%', flexShrink: 0, flexGrow: 0 }}>
        <EditTitle />
        <EditDescription />
      </Group>
      <Box sx={{ height: '100%', flexGrow: 1, maxWidth: '60%' }}>
        <PreviewPanel />
      </Box>
    </Group>
  )
}
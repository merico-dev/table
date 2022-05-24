import { Divider, Group } from "@mantine/core";
import { EditDescription } from "./description";
import { EditTitle } from "./title";
import { EditVizConf } from "./viz-conf";

interface IVizConfig {
}

export function VizConfig({ }: IVizConfig) {
  return (
    <Group grow direction="column">
      <EditTitle />
      <EditDescription />
      <Divider />
      <EditVizConf />
    </Group>
  )
}
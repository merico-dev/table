import { ActionIcon, JsonInput, Select, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import React from "react";
import { DeviceFloppy } from "tabler-icons-react";
import { PanelContext } from "../../../contexts/panel-context";
import { IVizConfig } from "../../../types/dashboard";
import { VizBar3DPanel } from "../../viz/bar-3d/panel";
import { VizCartesianChartPanel } from "../../viz/cartesian/panel";
import { VizPiePanel } from "../../viz/pie/panel";
import { VizStatsPanel } from "../../viz/stats/panel";
import { SunburstPanel } from "../../viz/sunburst/panel";
import { VizTablePanel } from "../../viz/table/panel";
import { VizTextPanel } from "../../viz/text/panel";

const types = [
  { value: 'text', label: 'Text', Panel: VizTextPanel },
  { value: 'stats', label: 'Stats', Panel: VizStatsPanel },
  { value: 'table', label: 'Table', Panel: VizTablePanel },
  { value: 'sunburst', label: 'Sunburst', Panel: SunburstPanel },
  { value: 'bar-3d', label: 'Bar Chart (3D)', Panel: VizBar3DPanel },
  { value: 'cartesian', label: 'Cartesian Chart', Panel: VizCartesianChartPanel },
  { value: 'pie', label: 'Pie Chart', Panel: VizPiePanel },
]

export function EditVizConf() {
  const { data, viz, setViz } = React.useContext(PanelContext)
  const [type, setType] = useInputState(viz.type);

  const changed = viz.type !== type;

  const submit = React.useCallback(() => {
    if (!changed) {
      return;
    }
    setViz(v => ({
      ...v,
      type,
    }));
  }, [changed, type]);

  const setVizConf = (conf: IVizConfig['conf']) => {
    setViz(v => ({ ...v, conf }))
  };

  const setVizConfByJSON = (conf: string) => {
    try {
      setVizConf(JSON.parse(conf));
    } catch (error) {
      console.error(error)
    }
  }

  const Panel = React.useMemo(() => {
    return types.find(t => t.value === type)?.Panel;
  }, [type, types])

  return (
    <>
      <Select
        label="Visualization"
        value={type}
        onChange={setType}
        data={types}
        rightSection={(
          <ActionIcon disabled={!changed} onClick={submit}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        )}
      />
      {/* @ts-expect-error */}
      {Panel && <Panel conf={viz.conf} setConf={setVizConf} data={data} />}
      {!Panel && <JsonInput minRows={20} label="Config" value={JSON.stringify(viz.conf, null, 2)} onChange={setVizConfByJSON} />}
    </>
  )
}
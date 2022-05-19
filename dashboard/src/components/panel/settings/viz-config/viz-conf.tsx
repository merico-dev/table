import { ActionIcon, JsonInput, Select, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import React from "react";
import { DeviceFloppy } from "tabler-icons-react";
import PanelContext from "../../../../contexts/panel-context";
import { IVizConfig } from "../../../../types/dashboard";
import { VizTablePanel } from "../../viz/table/panel";
import { VizTextPanel } from "../../viz/text/panel";

const types = [
  { value: 'text', label: 'Text', Panel: VizTextPanel },
  { value: 'table', label: 'Table', Panel: VizTablePanel },
  { value: 'sunburst', label: 'Sunburst' },
  { value: 'bar-3d', label: 'Bar Chart (3D)' },
  { value: 'line', label: 'Line Chart' },
]

export function EditVizConf() {
  const { viz, setViz } = React.useContext(PanelContext)
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
      {Panel && <Panel conf={viz.conf} setConf={setVizConf} />}
      {!Panel && <JsonInput minRows={20} label="Config" value={JSON.stringify(viz.conf, null, 2)} onChange={setVizConfByJSON} />}
    </>
  )
}
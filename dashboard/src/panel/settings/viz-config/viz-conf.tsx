import { ActionIcon, JsonInput, Select } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { get } from 'lodash';
import React, { createElement, useContext, useMemo } from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { PanelContext } from '../../../contexts';
import { IPanelInfo, IVizManager, PluginContext } from '../../../plugins';
import { IVizConfig } from '../../../types';
import { IPanelInfoEditor } from '../../../types/plugin';
import { VizBar3DPanel } from '../../viz/bar-3d/panel';
import { VizCartesianChartPanel } from '../../viz/cartesian/panel';
import { VizPiePanel } from '../../viz/pie/panel';
import { PluginVizConfigComponent } from '../../plugin-adaptor';
import { VizRadarChartPanel } from '../../viz/radar/panel';

const types = [
  { value: 'bar-3d', label: 'Bar Chart (3D)', Panel: VizBar3DPanel },
  {
    value: 'cartesian',
    label: 'Cartesian Chart',
    Panel: VizCartesianChartPanel,
  },
  {
    value: 'radar',
    label: 'Radar Chart',
    Panel: VizRadarChartPanel,
  },
  { value: 'pie', label: 'Pie Chart', Panel: VizPiePanel },
];

function useVizSelectData() {
  const { vizManager } = useContext(PluginContext);
  return useMemo(
    () =>
      vizManager.availableVizList
        .map((it) => ({
          value: it.name,
          label: it.displayName,
        }))
        .concat(types),
    [vizManager],
  );
}

function getPluginVizDefaultConfig(vizManager: IVizManager, type: string) {
  try {
    return vizManager.resolveComponent(type).createConfig();
  } catch (e) {
    return null;
  }
}

function usePluginVizConfig() {
  const { viz, title, data, queryID, description, setDescription, setTitle, setQueryID, setViz, id } =
    useContext(PanelContext);
  const { vizManager } = useContext(PluginContext);

  const panel: IPanelInfo = {
    title,
    description,
    viz,
    queryID,
    id,
  };
  const panelEditor: IPanelInfoEditor = {
    setDescription: setDescription,
    setQueryID: setQueryID,
    setTitle: setTitle,
  };
  try {
    vizManager.resolveComponent(panel.viz.type);
    return (
      <PluginVizConfigComponent
        setVizConf={setViz}
        panel={panel}
        panelInfoEditor={panelEditor}
        vizManager={vizManager}
        data={data}
      />
    );
  } catch (e) {
    console.info(get(e, 'message'));
    return null;
  }
}

export function EditVizConf() {
  const { data, viz, setViz } = React.useContext(PanelContext);
  const [type, setType] = useInputState(viz.type);

  const changed = viz.type !== type;
  const { vizManager } = useContext(PluginContext);

  const submit = React.useCallback(() => {
    if (!changed) {
      return;
    }
    const defaultConfig = getPluginVizDefaultConfig(vizManager, type);
    setViz({ conf: defaultConfig || {}, type });
  }, [changed, type]);

  const setVizConf = (conf: IVizConfig['conf']) => {
    setViz((v) => ({ ...v, conf }));
  };

  const setVizConfByJSON = (conf: string) => {
    try {
      setVizConf(JSON.parse(conf));
    } catch (error) {
      console.error(error);
    }
  };

  const Panel = React.useMemo(() => {
    return types.find((t) => t.value === type)?.Panel;
  }, [type, types]);

  const pluginPanel = usePluginVizConfig();
  const builtInPanel = Panel
    ? createElement(Panel as any, {
        data,
        conf: viz.conf,
        setConf: setVizConf,
      })
    : null;
  const finalPanel = pluginPanel || builtInPanel;
  const selectData = useVizSelectData();
  return (
    <>
      <Select
        label="Visualization"
        value={type}
        onChange={setType}
        data={selectData}
        rightSection={
          <ActionIcon disabled={!changed} onClick={submit}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        }
      />
      {finalPanel}
      {!finalPanel && (
        <JsonInput minRows={20} label="Config" value={JSON.stringify(viz.conf, null, 2)} onChange={setVizConfByJSON} />
      )}
    </>
  );
}

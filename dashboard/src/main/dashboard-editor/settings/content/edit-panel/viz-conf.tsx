import { ActionIcon, Box, Group, JsonInput, Select, Stack } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { get } from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { createElement, useContext, useMemo } from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { useConfigVizInstanceService } from '~/panel/use-config-viz-instance-service';
import { ServiceLocatorProvider } from '~/service-locator/use-service-locator';
import { usePanelContext } from '../../../../../contexts';
import { IPanelInfo, IVizManager, PluginContext } from '../../../../../plugins';
import { IPanelInfoEditor } from '../../../../../types/plugin';
import { PluginVizConfigComponent } from '../../../../../panel/plugin-adaptor';

const types = [] as $TSFixMe[];

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
  const {
    data,
    panel: { variables, viz, title, queryID, description, setDescription, setTitle, setQueryID, id },
  } = usePanelContext();
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
  const configureService = useConfigVizInstanceService(panel);
  try {
    vizManager.resolveComponent(panel.viz.type);
    return (
      <ServiceLocatorProvider configure={configureService}>
        <PluginVizConfigComponent
          variables={variables}
          setVizConf={viz.setConf}
          panel={panel}
          panelInfoEditor={panelEditor}
          vizManager={vizManager}
          data={data}
        />
      </ServiceLocatorProvider>
    );
  } catch (e) {
    console.info(get(e, 'message'));
    return null;
  }
}

export const EditVizConf = observer(() => {
  const {
    data,
    panel: { viz },
  } = usePanelContext();
  const [type, setType] = useInputState(viz.type);

  const changed = viz.type !== type;
  const { vizManager } = useContext(PluginContext);

  const submit = React.useCallback(() => {
    if (!changed) {
      return;
    }
    const defaultConfig = getPluginVizDefaultConfig(vizManager, type);
    viz.setType(type);
    viz.setConf(defaultConfig || {});
  }, [viz, changed, type]);

  const setVizConfByJSON = (conf: string) => {
    try {
      viz.setConf(JSON.parse(conf));
    } catch (error) {
      console.error(error);
    }
  };

  const Panel = React.useMemo(() => {
    return types.find((t) => t.value === type)?.Panel;
  }, [type, types]);

  const pluginPanel = usePluginVizConfig();
  const builtInPanel = Panel
    ? createElement(Panel as $TSFixMe, {
        data,
        conf: viz.conf,
        setConf: viz.setConf,
      })
    : null;
  const finalPanel = pluginPanel || builtInPanel;
  const selectData = useVizSelectData();
  return (
    <Stack align="stretch" sx={{ height: '100%', overflow: 'hidden' }}>
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
      <Box pb={50} sx={{ maxHeight: 'calc(100% - 80px)', overflow: 'auto' }}>
        {finalPanel}
      </Box>
      {!finalPanel && (
        <JsonInput minRows={20} label="Config" value={JSON.stringify(viz.conf, null, 2)} onChange={setVizConfByJSON} />
      )}
    </Stack>
  );
});

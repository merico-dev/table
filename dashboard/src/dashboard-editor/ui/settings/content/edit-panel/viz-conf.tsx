import { JsonInput, Stack } from '@mantine/core';
import { get } from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { createElement, useContext } from 'react';
import { PluginVizConfigComponent } from '~/components/panel/plugin-adaptor';
import { useConfigVizInstanceService } from '~/components/panel/use-config-viz-instance-service';
import { IPanelInfo, IVizManager, PluginContext } from '~/components/plugins';
import { ServiceLocatorProvider } from '~/components/plugins/service/service-locator/use-service-locator';
import { useEditPanelContext } from '~/contexts';
import { ErrorBoundary } from '~/utils/error-boundary';
import { SelectVizType } from './select-viz-type';

const types = [] as $TSFixMe[];

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
    panel: { variables, viz, title, queryIDs, description, setDescription, setTitle, addQueryID, removeQueryID, id },
  } = useEditPanelContext();
  const { vizManager } = useContext(PluginContext);

  const panel: IPanelInfo = {
    title,
    description,
    viz,
    queryIDs,
    id,
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
  } = useEditPanelContext();

  const { vizManager } = useContext(PluginContext);

  const submit = React.useCallback(
    (type: string) => {
      if (type === viz.type) {
        return;
      }
      const defaultConfig = getPluginVizDefaultConfig(vizManager, type);
      viz.setType(type);
      viz.setConf(defaultConfig || {});
    },
    [viz.type],
  );

  const setVizConfByJSON = (conf: string) => {
    try {
      viz.setConf(JSON.parse(conf));
    } catch (error) {
      console.error(error);
    }
  };

  const Panel = React.useMemo(() => {
    return types.find((t) => t.value === viz.type)?.Panel;
  }, [viz.type, types]);

  const pluginPanel = usePluginVizConfig();
  const builtInPanel = Panel
    ? createElement(Panel as $TSFixMe, {
        data,
        conf: viz.conf,
        setConf: viz.setConf,
      })
    : null;
  const finalPanel = pluginPanel || builtInPanel;
  return (
    <Stack align="stretch" sx={{ height: '100%', overflow: 'hidden' }}>
      <SelectVizType submit={submit} value={viz.type} />
      <ErrorBoundary>
        <Stack pb={10} sx={{ flexGrow: 1, maxHeight: '100%', overflow: 'auto' }}>
          {finalPanel}
        </Stack>
        {!finalPanel && (
          <JsonInput
            minRows={20}
            label="Config"
            value={JSON.stringify(viz.conf, null, 2)}
            onChange={setVizConfByJSON}
          />
        )}
      </ErrorBoundary>
    </Stack>
  );
});

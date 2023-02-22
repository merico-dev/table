import { LoadingOverlay, Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { PanelContextProvider, useModelContext } from '~/contexts';
import { InteractionSettingsPanel } from '~/interactions';
import { PanelModelInstance } from '~/model/views/view/panels';
import { ErrorBoundary } from '~/panel/error-boundary';
import { PanelConfig } from '~/panel/settings/panel-config';
import { PickQuery } from '~/panel/settings/pick-query';
import { VariableConfig } from '~/panel/settings/variable-config/variable-config-panel';
import { VizConfig } from '~/panel/settings/viz-config';

const TabsStyles = {
  root: {
    height: '100%',
  },
  panel: {
    height: 'calc(100% - 36px)',
  },
  // body: {
  //   flex: '1',
  //   overflow: 'auto',
  // },
} as const;

function doesVizRequiresData(type: string) {
  const vizTypes = ['richText', 'button'];
  return !vizTypes.includes(type);
}

export const PanelEditor = observer(({ panel }: { panel: PanelModelInstance }) => {
  const model = useModelContext();
  const [tab, setTab] = useState<string | null>('Visualization');
  const { data, state, error } = model.getDataStuffByID(panel.queryID);
  const panelNeedData = doesVizRequiresData(panel.viz.type);
  const loading = panelNeedData && state === 'loading';
  return (
    <PanelContextProvider value={{ panel, data, loading }}>
      <Tabs value={tab} onTabChange={setTab} keepMounted={false} styles={TabsStyles} sx={{ height: '100%' }}>
        <Tabs.List>
          <Tabs.Tab value="Data" disabled={loading}>
            Data
          </Tabs.Tab>
          <Tabs.Tab value="Panel">Panel</Tabs.Tab>
          <Tabs.Tab value="Variables" disabled={loading}>
            Variables
          </Tabs.Tab>
          <Tabs.Tab value="Visualization" disabled={loading}>
            Visualization
          </Tabs.Tab>
          <Tabs.Tab value="Interactions">Interactions</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="Data" p="sm">
          <LoadingOverlay visible={loading} exitTransitionDuration={0} />
          <PickQuery />
        </Tabs.Panel>
        <Tabs.Panel value="Panel" p="sm">
          <PanelConfig />
        </Tabs.Panel>
        <Tabs.Panel value="Variables" p="sm">
          <VariableConfig />
        </Tabs.Panel>
        <Tabs.Panel value="Visualization" p="sm">
          <ErrorBoundary>
            <VizConfig />
          </ErrorBoundary>
        </Tabs.Panel>
        <Tabs.Panel value="Interactions" p="sm">
          <ErrorBoundary>
            <InteractionSettingsPanel />
          </ErrorBoundary>
        </Tabs.Panel>
      </Tabs>
    </PanelContextProvider>
  );
});

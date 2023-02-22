import { Box, Group, LoadingOverlay, Tabs, Tooltip, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode, useState } from 'react';
import { PanelContextProvider, useModelContext } from '~/contexts';
import { InteractionSettingsPanel } from '~/interactions';
import { PanelModelInstance } from '~/model/views/view/panels';
import { ErrorBoundary } from '~/panel/error-boundary';
import { PanelConfig } from '~/panel/settings/panel-config';
import { PreviewPanel } from '~/panel/settings/panel-config/preview-panel';
import { PickQuery } from '~/panel/settings/pick-query';
import { VariableConfig } from '~/panel/settings/variable-config/variable-config-panel';
import { EditVizConf } from '~/panel/settings/viz-config/viz-conf';

const TabsStyles = {
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
  },
  panel: {
    width: '100%',
    height: '100%',
    padding: 10,
  },
} as const;

const WithPreview = ({ children }: { children: ReactNode }) => {
  return (
    <Group noWrap grow position="left" spacing={20} sx={{ width: '100%', height: 'calc(100% - 36px)' }}>
      <Box
        sx={{
          maxWidth: 'calc(100% - 610px - 10px)',
          height: '100%',
        }}
      >
        {children}
      </Box>
      <PreviewPanel />
    </Group>
  );
};

function doesVizRequiresData(type: string) {
  const vizTypes = ['richText', 'button'];
  return !vizTypes.includes(type);
}

export const PanelEditor = observer(({ panel }: { panel: PanelModelInstance }) => {
  const model = useModelContext();
  const [tab, setTab] = useState<string | null>('Visualization');
  const { data, state, error } = model.getDataStuffByID(panel.queryID);
  const query = model.queries.findByID(panel.queryID);

  const panelNeedData = doesVizRequiresData(panel.viz.type);
  const loading = panelNeedData && state === 'loading';
  const dataNotReady = loading || error || query?.stateMessage;

  return (
    <PanelContextProvider value={{ panel, data, loading, error }}>
      <Tabs value={tab} onTabChange={setTab} keepMounted={false} styles={TabsStyles}>
        <Tabs.List>
          <Tabs.Tab value="Data" disabled={loading}>
            Data
          </Tabs.Tab>
          <Tabs.Tab value="Panel">Panel</Tabs.Tab>
          <Tabs.Tab value="Variables" disabled={dataNotReady}>
            <Tooltip label="Requires data" disabled={!dataNotReady} withinPortal zIndex={310}>
              <Text>Variables</Text>
            </Tooltip>
          </Tabs.Tab>
          <Tabs.Tab value="Visualization" disabled={dataNotReady}>
            <Tooltip label="Requires data" disabled={!dataNotReady} withinPortal zIndex={310}>
              <Text>Visualization</Text>
            </Tooltip>
          </Tabs.Tab>
          <Tabs.Tab value="Interactions">Interactions</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Data">
          <LoadingOverlay visible={loading} exitTransitionDuration={0} />
          <PickQuery />
        </Tabs.Panel>

        <Tabs.Panel value="Panel">
          <WithPreview>
            <PanelConfig />
          </WithPreview>
        </Tabs.Panel>

        <Tabs.Panel value="Variables">
          <VariableConfig />
        </Tabs.Panel>

        <Tabs.Panel value="Visualization">
          <ErrorBoundary>
            <WithPreview>
              <EditVizConf />
            </WithPreview>
          </ErrorBoundary>
        </Tabs.Panel>

        <Tabs.Panel value="Interactions">
          <ErrorBoundary>
            <InteractionSettingsPanel />
          </ErrorBoundary>
        </Tabs.Panel>
      </Tabs>
    </PanelContextProvider>
  );
});

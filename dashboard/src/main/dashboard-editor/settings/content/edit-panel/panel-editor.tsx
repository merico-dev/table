import { Box, Group, LoadingOverlay, Tabs, Tooltip, Text, Button } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode, useEffect, useState } from 'react';
import { PanelContextProvider, useModelContext } from '~/contexts';
import { InteractionSettingsPanel } from '~/interactions';
import { PanelModelInstance } from '~/model/views/view/panels';
import { ErrorBoundary } from '~/utils/error-boundary';
import { PanelConfig } from '~/main/dashboard-editor/settings/content/edit-panel/panel-config';
import { PreviewPanel } from '~/main/dashboard-editor/settings/content/edit-panel/preview-panel';
import { PickQuery } from '~/main/dashboard-editor/settings/content/edit-panel/pick-query';
import { VariableConfig } from '~/main/dashboard-editor/settings/content/edit-panel/variable-config/variable-config-panel';
import { EditVizConf } from '~/main/dashboard-editor/settings/content/edit-panel/viz-conf';
import { IconTrash } from '@tabler/icons';
import { useModals } from '@mantine/modals';

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
          overflow: 'auto',
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
  const modals = useModals();
  const model = useModelContext();
  const [tab, setTab] = useState<string | null>('Data');
  const { data, state, error } = model.getDataStuffByID(panel.queryID);
  const query = model.queries.findByID(panel.queryID);

  const panelNeedData = doesVizRequiresData(panel.viz.type);
  const loading = panelNeedData && state === 'loading';
  const dataNotReady = loading || error || !query || !!query.stateMessage;

  useEffect(() => {
    setTab((tab) => {
      if (dataNotReady && tab === 'Visualization') {
        return 'Data';
      }
      return tab;
    });
  }, [panel.id, dataNotReady]);

  const resetEditorPath = () => {
    const p = model.editor.path;
    model.editor.setPath(['_VIEWS_', p[1]]);
  };

  const remove = () =>
    modals.openConfirmModal({
      title: 'Delete this panel?',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        panel.removeSelf();
        resetEditorPath();
      },
      confirmProps: { color: 'red' },
      zIndex: 320,
    });

  return (
    <PanelContextProvider value={{ panel, data, loading, error }}>
      <Group px={16} position="apart" sx={{ borderBottom: '1px solid #eee' }}>
        <Text pt={9} pb={8}>
          {panel.title ? panel.title : panel.viz.type}{' '}
        </Text>
        <Button size="xs" variant="subtle" color="red" onClick={remove} leftIcon={<IconTrash size={14} />}>
          Delete This Panel
        </Button>
      </Group>
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

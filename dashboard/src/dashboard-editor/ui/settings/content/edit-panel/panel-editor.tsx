import { Box, Button, Group, LoadingOverlay, Tabs, Text, Tooltip } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { ReactNode, useEffect, useState } from 'react';
import { PanelContextProvider, useEditContentModelContext, useEditDashboardContext } from '~/contexts';
import { PanelModelInstance } from '~/dashboard-editor/model/panels';
import { PanelConfig } from '~/dashboard-editor/ui/settings/content/edit-panel/panel-config';
import { PickQuery } from '~/dashboard-editor/ui/settings/content/edit-panel/pick-query';
import { PreviewPanel } from '~/dashboard-editor/ui/settings/content/edit-panel/preview-panel';
import { VariablesEditor } from './variable-config';
import { EditVizConf } from '~/dashboard-editor/ui/settings/content/edit-panel/viz-conf';
import { InteractionSettingsPanel } from '~/interactions';
import { ErrorBoundary } from '~/utils/error-boundary';
import { ChangeViewOfPanel } from './change-view-of-panel';

const TabsStyles = {
  root: {
    flexGrow: 1,
    width: '100%',
    overflow: 'hidden',
  },
  panel: {
    width: '100%',
    height: 'calc(100% - 44px)',
    padding: 10,
    overflow: 'scroll',
  },
} as const;

const WithPreview = ({ children }: { children: ReactNode }) => {
  return (
    <Group noWrap grow position="left" spacing={20} sx={{ width: '100%', height: '100%' }}>
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
  const model = useEditDashboardContext();
  const content = useEditContentModelContext();
  const [tab, setTab] = useState<string | null>('Data');
  const queries = panel.queries;

  const panelNeedData = doesVizRequiresData(panel.viz.type);
  const loading = panelNeedData && panel.dataLoading;
  const dataNotReady =
    loading || panel.queryErrors.length > 0 || panel.queryStateMessages !== '' || queries.length === 0;

  const viewID = model.editor.path[1];
  useEffect(() => {
    setTab((tab) => {
      if (dataNotReady && tab === 'Visualization') {
        return 'Data';
      }
      return tab;
    });
  }, [panel.id, dataNotReady]);

  const resetEditorPath = () => {
    model.editor.setPath(['_VIEWS_', viewID]);
  };

  const remove = () =>
    modals.openConfirmModal({
      title: 'Delete this panel?',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        content.removePanelByID(panel.id, viewID);
        resetEditorPath();
      },
      confirmProps: { color: 'red' },
      zIndex: 320,
    });

  return (
    <PanelContextProvider
      value={{ panel, data: panel.data, loading, errors: panel.queryErrors, downloadPanelScreenshot: () => {} }}
    >
      <Group px={16} position="apart" sx={{ borderBottom: '1px solid #eee' }}>
        <Text pt={9} pb={8}>
          {panel.name}
        </Text>
        <Group position="right" noWrap>
          <ChangeViewOfPanel panel={panel} sourceViewID={viewID} />
          <Button size="xs" variant="subtle" color="red" onClick={remove} leftIcon={<IconTrash size={14} />}>
            Delete This Panel
          </Button>
        </Group>
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
          <VariablesEditor />
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

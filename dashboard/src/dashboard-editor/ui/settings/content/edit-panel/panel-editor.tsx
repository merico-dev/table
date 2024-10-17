import { Box, Button, Group, LoadingOverlay, Stack, Tabs, Text, Tooltip } from '@mantine/core';
import { useModals } from '@mantine/modals';
import {
  IconAppWindow,
  IconChartHistogram,
  IconDatabase,
  IconRoute,
  IconTrash,
  IconVariable,
} from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PanelContextProvider, useEditContentModelContext, useEditDashboardContext } from '~/contexts';
import { PanelModelInstance } from '~/dashboard-editor/model/panels';
import { PanelConfig } from '~/dashboard-editor/ui/settings/content/edit-panel/panel-config';
import { PickQuery } from '~/dashboard-editor/ui/settings/content/edit-panel/pick-query';
import { PreviewPanel } from '~/dashboard-editor/ui/settings/content/edit-panel/preview-panel';
import { EditVizConf } from '~/dashboard-editor/ui/settings/content/edit-panel/viz-conf';
import { InteractionSettingsPanel } from '~/interactions';
import { ErrorBoundary } from '~/utils';
import { ChangeViewOfPanel } from './change-view-of-panel';
import { PanelVariablesGuide } from './panel-variables-guide';
import { VariablesEditor } from './variable-config';
import { PanelTab } from '~/dashboard-editor/model/editor';

const TabsStyles = {
  root: {
    flexGrow: 1,
    width: '100%',
    minWidth: '1200px',
    overflow: 'hidden',
  },
  panel: {
    width: '100%',
    minWidth: '1200px',
    height: 'calc(100% - 44px)',
    padding: 10,
    overflow: 'auto',
  },
} as const;

const WithPreview = ({ children }: { children: ReactNode }) => {
  return (
    <Group wrap="nowrap" grow position="left" gap={20} sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <Box
        sx={{
          maxWidth: 'calc(100% - 610px - 10px)',
          height: '100%',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
      <Stack justify="flex-start" sx={{ alignSelf: 'flex-start', width: '600px', flexGrow: 0, flexShrink: 0 }}>
        <PreviewPanel />
        <Box sx={{ flexGrow: 1 }}>
          <PanelVariablesGuide />
        </Box>
      </Stack>
    </Group>
  );
};

function doesVizRequiresData(type: string) {
  const vizTypes = ['richText', 'button'];
  return !vizTypes.includes(type);
}

export const PanelEditor = observer(({ panel }: { panel: PanelModelInstance }) => {
  const { t } = useTranslation();
  const modals = useModals();
  const model = useEditDashboardContext();
  const content = useEditContentModelContext();
  const [tab, setTab] = useState<PanelTab | null>(model.editor.panelTab);
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

  const handleTabChange = useCallback((t: string | null) => {
    setTab(t as PanelTab | null);
    model.editor.setPanelTab(tab);
  }, []);

  const resetEditorPath = () => {
    model.editor.setPath(['_VIEWS_', viewID]);
  };

  const remove = () =>
    modals.openConfirmModal({
      title: `${t('panel.delete')}?`,
      labels: { confirm: t('common.actions.confirm'), cancel: t('common.actions.cancel') },
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
      <Group px={16} justify="apart" sx={{ borderBottom: '1px solid #eee' }}>
        <Text pt={9} pb={8}>
          {panel.name}
        </Text>
        <Group justify="flex-end" wrap="nowrap">
          <ChangeViewOfPanel panel={panel} sourceViewID={viewID} />
          <Button size="xs" variant="subtle" color="red" onClick={remove} leftIcon={<IconTrash size={14} />}>
            {t('panel.delete')}
          </Button>
        </Group>
      </Group>
      <Tabs value={tab} onTabChange={handleTabChange} keepMounted={false} styles={TabsStyles}>
        <Tabs.List>
          <Tabs.Tab value="Data" icon={<IconDatabase size={14} />} disabled={loading}>
            {t('data.label')}
          </Tabs.Tab>
          <Tabs.Tab value="Panel" icon={<IconAppWindow size={14} />}>
            {t('panel.label')}
          </Tabs.Tab>
          <Tabs.Tab value="Variables" icon={<IconVariable size={14} />} disabled={dataNotReady}>
            <Tooltip label={t('data.requires_data')} disabled={!dataNotReady} withinPortal zIndex={310}>
              <Text>{t('panel.variable.labels')}</Text>
            </Tooltip>
          </Tabs.Tab>
          <Tabs.Tab value="Visualization" icon={<IconChartHistogram size={14} />} disabled={dataNotReady}>
            <Tooltip label={t('data.requires_data')} disabled={!dataNotReady} withinPortal zIndex={310}>
              <Text>{t('visualization.label')}</Text>
            </Tooltip>
          </Tabs.Tab>
          <Tabs.Tab value="Interactions" icon={<IconRoute size={14} />}>
            {t('interactions.label')}
          </Tabs.Tab>
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
          <WithPreview>
            <VariablesEditor />
          </WithPreview>
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

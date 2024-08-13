import { Box, Divider, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import {
  IconAppWindow,
  IconArrowsMaximize,
  IconCamera,
  IconChartHistogram,
  IconCode,
  IconCopy,
  IconDownload,
  IconRefresh,
  IconRoute,
  IconTrash,
  IconVariable,
} from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext, useEditDashboardContext } from '~/contexts';
import { DashboardActionContext } from '~/contexts/dashboard-action-context';
import { useEditPanelContext } from '~/contexts/panel-context';
import { EViewComponentType, ViewMetaInstance } from '~/model';
import { QueryMenuItems } from './query-menu-items';

export const PanelDropdownMenu = observer(({ view, title }: { view: ViewMetaInstance; title: string }) => {
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  const content = useEditContentModelContext();
  const modals = useModals();

  const { panel, downloadPanelScreenshot } = useEditPanelContext();
  const { id } = panel;

  const { viewPanelInFullScreen, inFullScreen } = React.useContext(DashboardActionContext);
  const duplicate = () => {
    content.duplicatePanelByID(id, view.id);
  };

  const openTabPanel = () => {
    model.editor.open(['_VIEWS_', view.id, '_PANELS_', id, '_TABS_', 'Panel']);
  };
  const openTabVar = () => {
    model.editor.open(['_VIEWS_', view.id, '_PANELS_', id, '_TABS_', 'Variables']);
  };
  const openTabViz = () => {
    model.editor.open(['_VIEWS_', view.id, '_PANELS_', id, '_TABS_', 'Visualization']);
  };
  const openTabInteraction = () => {
    model.editor.open(['_VIEWS_', view.id, '_PANELS_', id, '_TABS_', 'Interactions']);
  };

  const remove = () =>
    modals.openConfirmModal({
      title: `${t('panel.delete')}?`,
      labels: { confirm: t('common.actions.confirm'), cancel: t('common.actions.cancel') },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => content.removePanelByID(id, view.id),
      confirmProps: { color: 'red' },
      zIndex: 320,
    });

  const enterFullScreen = React.useCallback(() => {
    viewPanelInFullScreen(id);
  }, [id, viewPanelInFullScreen]);
  const showFullScreenOption = !inFullScreen && view.type !== EViewComponentType.Modal;
  return (
    <>
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 300 }} title={title}>
        <Menu withinPortal>
          <Menu.Target>
            <Box className="panel-dropdown-target" sx={{ width: '100%' }}></Box>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={panel.refreshData} icon={<IconRefresh size={14} />}>
              {t('common.actions.refresh')}
            </Menu.Item>
            <Menu.Item onClick={panel.downloadData} icon={<IconDownload size={14} />}>
              {t('common.actions.download_data')}
            </Menu.Item>
            <Menu.Item onClick={panel.downloadSchema} icon={<IconCode size={14} />}>
              {t('common.actions.download_schema')}
            </Menu.Item>
            <Menu.Item onClick={downloadPanelScreenshot} icon={<IconCamera size={14} />}>
              {t('common.actions.download_screenshot')}
            </Menu.Item>
            {showFullScreenOption && (
              <Menu.Item onClick={enterFullScreen} icon={<IconArrowsMaximize size={14} />} disabled>
                {t('common.actions.enter_fullscreen')}
              </Menu.Item>
            )}

            <QueryMenuItems view={view} />

            <Divider label={t('common.actions.edit')} labelPosition="center" />
            <Menu.Item onClick={openTabPanel} icon={<IconAppWindow size={14} />}>
              {t('panel.label')}
            </Menu.Item>
            <Menu.Item onClick={openTabVar} icon={<IconVariable size={14} />}>
              {t('panel.variable.labels')}
            </Menu.Item>
            <Menu.Item onClick={openTabViz} icon={<IconChartHistogram size={14} />}>
              {t('visualization.label')}
            </Menu.Item>
            <Menu.Item onClick={openTabInteraction} icon={<IconRoute size={14} />}>
              {t('interactions.label')}
            </Menu.Item>

            <Divider label={t('common.actions.actions')} labelPosition="center" />
            <Menu.Item onClick={duplicate} icon={<IconCopy size={14} />}>
              {t('common.actions.duplicate')}
            </Menu.Item>
            <Menu.Item color="red" onClick={remove} icon={<IconTrash size={14} />}>
              {t('common.actions.delete')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </>
  );
});

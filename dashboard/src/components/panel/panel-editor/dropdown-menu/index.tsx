import { Box, Divider, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconCamera, IconCode } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowsMaximize, Copy, Download, Refresh, Settings, Trash } from 'tabler-icons-react';
import { useEditContentModelContext, useEditDashboardContext } from '~/contexts';
import { DashboardActionContext } from '~/contexts/dashboard-action-context';
import { useEditPanelContext } from '~/contexts/panel-context';
import { EViewComponentType, ViewMetaInstance } from '~/model';

export const PanelDropdownMenu = observer(({ view }: { view: ViewMetaInstance }) => {
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

  const openPanelEditor = () => {
    model.editor.open(['_VIEWS_', view.id, '_PANELS_', id]);
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
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 300 }}>
        <Menu withinPortal>
          <Menu.Target>
            <Box className="panel-dropdown-target" sx={{ width: '100%' }}></Box>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={panel.refreshData} icon={<Refresh size={14} />}>
              {t('common.actions.refresh')}
            </Menu.Item>
            <Menu.Item onClick={panel.downloadData} icon={<Download size={14} />}>
              {t('common.actions.download_data')}
            </Menu.Item>
            <Menu.Item onClick={panel.downloadSchema} icon={<IconCode size={14} />}>
              {t('common.actions.download_schema')}
            </Menu.Item>
            <Menu.Item onClick={downloadPanelScreenshot} icon={<IconCamera size={14} />}>
              {t('common.actions.download_screenshot')}
            </Menu.Item>
            {showFullScreenOption && (
              <Menu.Item onClick={enterFullScreen} icon={<ArrowsMaximize size={14} />} disabled>
                {t('common.actions.enter_fullscreen')}
              </Menu.Item>
            )}

            <Divider label={t('common.actions.edit')} labelPosition="center" />
            <Menu.Item onClick={openPanelEditor} icon={<Settings size={14} />}>
              {t('common.titles.settings')}
            </Menu.Item>
            <Menu.Item onClick={duplicate} icon={<Copy size={14} />}>
              {t('common.actions.duplicate')}
            </Menu.Item>
            <Menu.Item color="red" onClick={remove} icon={<Trash size={14} />}>
              {t('common.actions.delete')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </>
  );
});

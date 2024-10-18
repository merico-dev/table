import { Box, Menu } from '@mantine/core';
import { IconArrowsMaximize, IconCamera, IconDownload, IconRefresh } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useTranslation } from 'react-i18next';
import { DashboardActionContext } from '~/contexts/dashboard-action-context';
import { useRenderPanelContext } from '~/contexts/panel-context';
import { EViewComponentType, ViewMetaInstance } from '~/model';
import { doesVizRequiresData } from '../../utils';

export const PanelDropdownMenu = observer(({ view, title }: { view: ViewMetaInstance; title: string }) => {
  const { t } = useTranslation();
  const { panel, downloadPanelScreenshot } = useRenderPanelContext();
  const { id } = panel;

  const { viewPanelInFullScreen, inFullScreen } = React.useContext(DashboardActionContext);

  const enterFullScreen = React.useCallback(() => {
    viewPanelInFullScreen(id);
  }, [id, viewPanelInFullScreen]);
  const showFullScreenOption = !inFullScreen && view.type !== EViewComponentType.Modal;

  const panelNeedData = doesVizRequiresData(panel.viz.type);
  if (!panelNeedData) {
    return null;
  }

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 300 }} title={title}>
      <Menu withinPortal>
        <Menu.Target>
          <Box className="panel-dropdown-target" />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={panel.refreshData} leftSection={<IconRefresh size={14} />}>
            {t('common.actions.refresh')}
          </Menu.Item>
          <Menu.Item onClick={panel.downloadData} leftSection={<IconDownload size={14} />}>
            {t('common.actions.download_data')}
          </Menu.Item>
          <Menu.Item onClick={downloadPanelScreenshot} leftSection={<IconCamera size={14} />}>
            {t('common.actions.download_screenshot')}
          </Menu.Item>
          {showFullScreenOption && (
            <Menu.Item onClick={enterFullScreen} leftSection={<IconArrowsMaximize size={14} />}>
              {t('common.actions.enter_fullscreen')}
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
});

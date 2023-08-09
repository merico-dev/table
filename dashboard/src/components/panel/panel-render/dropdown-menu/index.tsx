import { Box, Menu } from '@mantine/core';
import { IconCamera } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { ArrowsMaximize, Download, Refresh } from 'tabler-icons-react';
import { DashboardActionContext } from '~/contexts/dashboard-action-context';
import { useRenderPanelContext } from '~/contexts/panel-context';
import { EViewComponentType, ViewMetaInstance } from '~/model';
import { doesVizRequiresData } from '../../utils';

export const PanelDropdownMenu = observer(({ view }: { view: ViewMetaInstance }) => {
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
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 300 }}>
      <Menu withinPortal>
        <Menu.Target>
          <Box className="panel-dropdown-target" sx={{ width: '100%', height: '25px' }}></Box>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={panel.refreshData} icon={<Refresh size={14} />}>
            Refresh
          </Menu.Item>
          <Menu.Item onClick={panel.downloadData} icon={<Download size={14} />}>
            Download Data
          </Menu.Item>
          <Menu.Item onClick={downloadPanelScreenshot} icon={<IconCamera size={14} />}>
            Screenshot
          </Menu.Item>
          {showFullScreenOption && (
            <Menu.Item onClick={enterFullScreen} icon={<ArrowsMaximize size={14} />}>
              Full Screen
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
});

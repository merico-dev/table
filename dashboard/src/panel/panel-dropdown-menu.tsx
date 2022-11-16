import { Box, Divider, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { ArrowsMaximize, Copy, Download, Refresh, Settings, Trash } from 'tabler-icons-react';
import { ViewModelInstance } from '..';
import { useModelContext } from '../contexts';
import { DashboardActionContext } from '../contexts/dashboard-action-context';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { usePanelContext } from '../contexts/panel-context';
import { PanelSettingsModal } from './settings';

export const PanelDropdownMenu = observer(({ view }: { view: ViewModelInstance }) => {
  const model = useModelContext();
  const modals = useModals();
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);

  const { panel } = usePanelContext();
  const { id, queryID } = panel;

  const { inEditMode } = React.useContext(LayoutStateContext);
  const refreshData = () => model.queries.refetchDataByQueryID(queryID.id);

  const { viewPanelInFullScreen, inFullScreen } = React.useContext(DashboardActionContext);
  const duplicate = () => {
    view.panels.duplicateByID(id);
  };

  const remove = () =>
    modals.openConfirmModal({
      title: 'Delete this panel?',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => view.panels.removeByID(id),
    });

  const enterFullScreen = React.useCallback(() => {
    viewPanelInFullScreen(id);
  }, [id, viewPanelInFullScreen]);
  return (
    <>
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 300 }}>
        <Menu withinPortal>
          <Menu.Target>
            <Box className="panel-dropdown-target" sx={{ width: '100%', height: '25px' }}></Box>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={refreshData} icon={<Refresh size={14} />}>
              Refresh
            </Menu.Item>
            <Menu.Item onClick={() => model.queries.downloadDataByQueryID(queryID.id)} icon={<Download size={14} />}>
              Download Data
            </Menu.Item>
            {!inFullScreen && (
              <Menu.Item onClick={enterFullScreen} icon={<ArrowsMaximize size={14} />}>
                Full Screen
              </Menu.Item>
            )}
            {inEditMode && (
              <>
                <Divider label="Edit" labelPosition="center" />
                <Menu.Item onClick={open} icon={<Settings size={14} />}>
                  Settings
                </Menu.Item>
                <Menu.Item onClick={duplicate} icon={<Copy size={14} />}>
                  Duplicate
                </Menu.Item>
                <Menu.Item color="red" onClick={remove} icon={<Trash size={14} />}>
                  Delete
                </Menu.Item>
              </>
            )}
          </Menu.Dropdown>
        </Menu>
      </Box>
      {inEditMode && <PanelSettingsModal opened={opened} close={close} />}
    </>
  );
});

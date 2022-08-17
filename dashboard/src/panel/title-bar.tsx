import { Group, Text, Menu, Divider, Box } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { ArrowsMaximize, Copy, Download, Refresh, Settings, Trash } from 'tabler-icons-react';
import { useModelContext } from '../contexts';
import { DashboardActionContext } from '../contexts/dashboard-action-context';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { PanelContext } from '../contexts/panel-context';
import { DescriptionPopover } from './panel-description';
import { PanelSettingsModal } from './settings';
import './title-bar.css';

interface IPanelTitleBar {}

export const PanelTitleBar = observer(function _PanelTitleBar({}: IPanelTitleBar) {
  const model = useModelContext();
  const modals = useModals();
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);

  const { id, title, queryID } = React.useContext(PanelContext);
  const { inEditMode } = React.useContext(LayoutStateContext);
  const refreshData = () => model.queries.refetchDataByQueryID(queryID);

  const { duplidatePanel, removePanelByID, viewPanelInFullScreen, inFullScreen } =
    React.useContext(DashboardActionContext);
  const duplicate = React.useCallback(() => {
    duplidatePanel(id);
  }, [duplidatePanel, id]);

  const remove = () =>
    modals.openConfirmModal({
      title: 'Delete this panel?',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => removePanelByID(id),
    });

  const enterFullScreen = React.useCallback(() => {
    viewPanelInFullScreen(id);
  }, [id, viewPanelInFullScreen]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ position: 'absolute', left: 0, top: 0, height: 28 }}>
        <DescriptionPopover />
      </Box>
      <Group grow position="center" px={20} className="panel-title-wrapper" sx={{ flexGrow: 1 }}>
        <Menu>
          <Menu.Target>
            <Text lineClamp={1} weight="bold">
              {title}
            </Text>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={refreshData} icon={<Refresh size={14} />}>
              Refresh
            </Menu.Item>
            <Menu.Item onClick={() => model.queries.downloadDataByQueryID(queryID)} icon={<Download size={14} />}>
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
      </Group>
      {inEditMode && <PanelSettingsModal opened={opened} close={close} />}
    </Box>
  );
});

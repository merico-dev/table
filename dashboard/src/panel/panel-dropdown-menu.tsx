import { Box, Divider, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { ArrowsMaximize, Copy, Download, Refresh, Settings, Trash } from 'tabler-icons-react';
import { EViewComponentType, ViewModelInstance } from '..';
import { useModelContext } from '../contexts';
import { DashboardActionContext } from '../contexts/dashboard-action-context';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { usePanelContext } from '../contexts/panel-context';

export const PanelDropdownMenu = observer(({ view }: { view: ViewModelInstance }) => {
  const model = useModelContext();
  const modals = useModals();

  const { panel } = usePanelContext();
  const { id, query } = panel;

  const { inEditMode } = React.useContext(LayoutStateContext);
  const refreshData = () => query?.fetchData();

  const { viewPanelInFullScreen, inFullScreen } = React.useContext(DashboardActionContext);
  const duplicate = () => {
    view.panels.duplicateByID(id);
  };

  const openPanelEditor = () => {
    model.editor.open(['_VIEWS_', view.id, '_PANELS_', id]);
  };

  const remove = () =>
    modals.openConfirmModal({
      title: 'Delete this panel?',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => view.panels.removeByID(id),
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
            <Box className="panel-dropdown-target" sx={{ width: '100%', height: '25px' }}></Box>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={refreshData} icon={<Refresh size={14} />}>
              Refresh
            </Menu.Item>
            <Menu.Item
              onClick={() => model.queries.downloadDataByQueryID(query?.id ?? '')}
              icon={<Download size={14} />}
            >
              Download Data
            </Menu.Item>
            {showFullScreenOption && (
              <Menu.Item onClick={enterFullScreen} icon={<ArrowsMaximize size={14} />} disabled={inEditMode}>
                Full Screen
              </Menu.Item>
            )}
            {inEditMode && (
              <>
                <Divider label="Edit" labelPosition="center" />
                <Menu.Item onClick={openPanelEditor} icon={<Settings size={14} />}>
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
    </>
  );
});

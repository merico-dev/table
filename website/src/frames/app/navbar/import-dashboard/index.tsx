import { ActionIcon, Modal, Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { FileImport } from 'tabler-icons-react';
import { useDashboardStore } from '../../models/dashboard-store-context';
import { ImportDashboardForm } from './form';

export const ImportDashboard = observer(() => {
  const { store } = useDashboardStore();
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const closeOnSuccess = () => {
    close();
    store.load();
  };
  return (
    <>
      <Modal
        overflow="inside"
        opened={opened}
        onClose={() => setOpened(false)}
        title="Import a dashboard from JSON file"
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <ImportDashboardForm postSubmit={closeOnSuccess} />
      </Modal>
      <Tooltip label="Import a dashboard">
        <ActionIcon color="blue" variant="light" onClick={open}>
          <FileImport size={17} />
        </ActionIcon>
      </Tooltip>
    </>
  );
});

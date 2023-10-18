import { Button, Modal } from '@mantine/core';
import { IconFileImport } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import React from 'react';
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
      <Button size="xs" variant="light" onClick={open} leftIcon={<IconFileImport size={15} />}>
        Import...
      </Button>
    </>
  );
});

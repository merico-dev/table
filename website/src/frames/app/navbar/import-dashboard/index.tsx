import { ActionIcon, Modal, Tooltip } from '@mantine/core';
import React from 'react';
import { FileImport } from 'tabler-icons-react';
import { ImportDashboardForm } from './form';

export function ImportDashboard() {
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);

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
        <ImportDashboardForm postSubmit={close} />
      </Modal>
      <Tooltip label="Import a dashboard">
        <ActionIcon color="blue" variant="light" onClick={open}>
          <FileImport size={17} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}

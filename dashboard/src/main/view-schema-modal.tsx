import { Modal } from '@mantine/core';
import { Prism } from '@mantine/prism';
import React from 'react';
import { LayoutStateContext } from '../contexts/layout-state-context';

interface IViewSchemaModal {
  opened: boolean;
  close: () => void;
  getCurrentSchema: () => $TSFixMe;
}

export function ViewSchemaModal({ opened, close, getCurrentSchema }: IViewSchemaModal) {
  const { freezeLayout } = React.useContext(LayoutStateContext);

  React.useEffect(() => {
    freezeLayout(opened);
  }, [opened]);

  const schema = React.useMemo(() => {
    return JSON.stringify(getCurrentSchema(), null, 2);
  }, [opened]);

  return (
    <Modal
      size="96vw"
      overflow="inside"
      opened={opened}
      onClose={close}
      title="This dashboard is described by this schema"
      trapFocus
      onDragStart={(e) => {
        e.stopPropagation();
      }}
    >
      <Prism language="json" sx={{ width: '100%' }} colorScheme="dark">
        {schema}
      </Prism>
    </Modal>
  );
}

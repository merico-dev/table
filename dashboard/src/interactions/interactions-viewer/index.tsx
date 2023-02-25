import { Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { LayoutStateContext } from '~/contexts';
import { InteractionsViewer } from './viewer';

interface IInteractionsViewerModal {
  opened: boolean;
  close: () => void;
}

export const InteractionsViewerModal = observer(({ opened, close }: IInteractionsViewerModal) => {
  const { freezeLayout } = React.useContext(LayoutStateContext);

  React.useEffect(() => {
    freezeLayout(opened);
  }, [opened]);

  return (
    <Modal
      size="96vw"
      overflow="inside"
      opened={opened}
      onClose={close}
      // closeOnClickOutside={false}
      // closeOnEscape={true}
      title="Interactions"
      trapFocus
      onDragStart={(e) => {
        e.stopPropagation();
      }}
      styles={{
        body: {
          height: '90vh',
        },
        modal: {
          transform: 'none !important',
        },
      }}
      zIndex={300}
    >
      <InteractionsViewer />
    </Modal>
  );
});

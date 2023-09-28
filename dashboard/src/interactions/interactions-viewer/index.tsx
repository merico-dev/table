import { Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { InteractionsViewer } from './viewer';

interface IInteractionsViewerModal {
  opened: boolean;
  close: () => void;
}

export const InteractionsViewerModal = observer(({ opened, close }: IInteractionsViewerModal) => {
  return (
    <Modal
      size="96vw"
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
          height: 'calc(90vh - 54px)',
        },
        content: {
          transform: 'none !important',
        },
      }}
      zIndex={300}
    >
      <InteractionsViewer />
    </Modal>
  );
});

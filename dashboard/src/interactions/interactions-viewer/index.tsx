import { Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { InteractionsViewer } from './viewer';
import { useTranslation } from 'react-i18next';

interface IInteractionsViewerModal {
  opened: boolean;
  close: () => void;
}

export const InteractionsViewerModal = observer(({ opened, close }: IInteractionsViewerModal) => {
  const { t } = useTranslation();
  return (
    <Modal
      size="96vw"
      opened={opened}
      onClose={close}
      // closeOnClickOutside={false}
      // closeOnEscape={true}
      title={t('interactions.interactions_viewer')}
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

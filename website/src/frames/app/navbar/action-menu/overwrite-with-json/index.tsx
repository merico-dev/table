import { Modal } from '@mantine/core';
import { OverwriteWithJSONForm } from './form';

export function OverwriteWithJSONModal({
  id,
  name,
  opened,
  close,
}: {
  id: string;
  name: string;
  opened: boolean;
  close: () => void;
}) {
  if (!id) {
    return null;
  }

  return (
    <Modal
      overflow="inside"
      opened={opened}
      onClose={close}
      title="Overwrite with JSON file"
      trapFocus
      onDragStart={(e) => {
        e.stopPropagation();
      }}
    >
      <OverwriteWithJSONForm id={id} name={name} postSubmit={close} />
    </Modal>
  );
}

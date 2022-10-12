import { Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { LayoutStateContext } from '~/contexts';

interface IEditViewModal {
  opened: boolean;
  close: () => void;
}

export const EditViewModal = observer(({ opened, close }: IEditViewModal) => {
  const { freezeLayout } = React.useContext(LayoutStateContext);

  React.useEffect(() => {
    freezeLayout(opened);
  }, [opened]);

  return (
    <Modal
      size="500px"
      overflow="inside"
      opened={opened}
      onClose={close}
      title="Edit View"
      trapFocus
      onDragStart={(e) => {
        e.stopPropagation();
      }}
    >
      Edit View Form
    </Modal>
  );
});

import { Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { LayoutStateContext, useModelContext } from '~/contexts';
import { EditViewForm } from './form';

interface IEditViewModal {
  opened: boolean;
  close: () => void;
}

export const EditViewModal = observer(({ opened, close }: IEditViewModal) => {
  const model = useModelContext();
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
      withCloseButton={false}
      title={`Editing ${model.views.VIE?.id}`}
      trapFocus
      onDragStart={(e) => {
        e.stopPropagation();
      }}
    >
      <EditViewForm />
    </Modal>
  );
});

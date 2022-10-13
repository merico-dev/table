import { ActionIcon, Group, Modal, Text } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Trash } from 'tabler-icons-react';
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
      styles={{
        header: {
          width: '100%',
        },
        title: {
          width: '100%',
        },
      }}
      title={
        <Group position="apart">
          <Text sx={{ flexGrow: 1 }}>Editing {model.views.VIE?.id}</Text>
          <ActionIcon size={18} color="red" onClick={model.views.removeVIE} disabled={model.views.isVIETheFirstView}>
            <Trash size={18} />
          </ActionIcon>
        </Group>
      }
      trapFocus
      onDragStart={(e) => {
        e.stopPropagation();
      }}
    >
      <EditViewForm />
    </Modal>
  );
});

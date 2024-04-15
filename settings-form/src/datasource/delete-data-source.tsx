import { Button, Text, Tooltip } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconLock } from '@tabler/icons-react';
import { Trash } from 'tabler-icons-react';

import { APICaller } from '../api-caller';
import { defaultStyles, IStyles } from './styles';

interface IDeleteDataSource {
  id: string;
  name: string;
  onSuccess: () => void;
  styles?: IStyles;
  isProtected?: boolean;
}

export function DeleteDataSource({ id, name, isProtected, onSuccess, styles = defaultStyles }: IDeleteDataSource) {
  const modals = useModals();

  const doDelete = async () => {
    if (!id) {
      return;
    }
    showNotification({
      id: 'for-deleting',
      title: 'Pending',
      message: 'Deleting data source...',
      loading: true,
      autoClose: false,
    });
    await APICaller.datasource.delete(id);
    updateNotification({
      id: 'for-deleting',
      title: 'Successful',
      message: `Data source [${name}] is deleted`,
      color: 'green',
      autoClose: true,
    });
    onSuccess();
  };

  const confirmAndDelete = () =>
    modals.openConfirmModal({
      title: 'Delete this data source?',
      children: <Text size={styles.size}>This action won't affect your database.</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: doDelete,
    });

  if (isProtected) {
    return (
      <Tooltip
        withArrow
        events={{ hover: true, touch: false, focus: false }}
        label="This is a preset datasource, it can not be deleted"
      >
        <Button
          size={styles.button.size}
          color="gray"
          variant="light"
          leftIcon={<IconLock size={16} />}
          sx={{ transform: 'none !important' }}
        >
          Delete
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button size={styles.button.size} color="red" onClick={confirmAndDelete} leftIcon={<Trash size={16} />}>
      Delete
    </Button>
  );
}

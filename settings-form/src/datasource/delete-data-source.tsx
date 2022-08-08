import { Button, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { Trash } from 'tabler-icons-react';
import { APICaller } from '../api-caller';
import { defaultStyles, IStyles } from './styles';

interface IDeleteDataSource {
  id: string;
  name: string;
  onSuccess: () => void;
  styles?: IStyles;
}

export function DeleteDataSource({ id, name, onSuccess, styles = defaultStyles }: IDeleteDataSource) {
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
    });
    await APICaller.datasource.delete(id);
    updateNotification({
      id: 'for-deleting',
      title: 'Successful',
      message: `Data source [${name}] is deleted`,
      color: 'green',
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

  return (
    <Button size={styles.size} color="red" onClick={confirmAndDelete} leftIcon={<Trash size={20} />}>
      Delete
    </Button>
  );
}

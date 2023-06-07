import { Button } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { Trash } from 'tabler-icons-react';
import { APICaller } from '../api-caller';
import { IStyles, defaultStyles } from './styles';

interface IDeleteSQLSnippet {
  id: string;
  onSuccess: () => void;
  styles?: IStyles;
}

export function DeleteSQLSnippet({ id, onSuccess, styles = defaultStyles }: IDeleteSQLSnippet) {
  const modals = useModals();

  const doDelete = async () => {
    if (!id) {
      return;
    }
    showNotification({
      id: 'for-deleting',
      title: 'Pending',
      message: 'Deleting SQL Snippet...',
      loading: true,
    });
    try {
      await APICaller.sql_snippet.delete(id);
      updateNotification({
        id: 'for-deleting',
        title: 'Successful',
        message: `SQL Snippet [${id}] is deleted`,
        color: 'green',
      });
      onSuccess();
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-deleting',
        title: 'Failed',
        message: error.message,
        color: 'red',
      });
    }
  };

  const confirmAndDelete = () =>
    modals.openConfirmModal({
      title: 'Delete this SQL Snippet?',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: doDelete,
      confirmProps: {
        color: 'red',
      },
    });

  return (
    <Button size={styles.button.size} color="red" onClick={confirmAndDelete} leftIcon={<Trash size={20} />}>
      Delete
    </Button>
  );
}

import { Button, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { Trash } from 'tabler-icons-react';
import { APICaller } from '../api-caller';
import { defaultStyles, IStyles } from './styles';

interface IDeleteAccount {
  id: string;
  name: string;
  onSuccess: () => void;
  styles?: IStyles;
}

export function DeleteAccount({ id, name, onSuccess, styles = defaultStyles }: IDeleteAccount) {
  const modals = useModals();

  const doDelete = async () => {
    if (!id) {
      return;
    }
    showNotification({
      id: 'for-deleting',
      title: 'Pending',
      message: 'Deleting account...',
      loading: true,
    });
    try {
      await APICaller.account.delete(id);
      updateNotification({
        id: 'for-deleting',
        title: 'Successful',
        message: `Account [${name}] is deleted`,
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
      title: 'Delete this account?',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: doDelete,
    });

  return (
    <Button size={styles.button.size} color="red" onClick={confirmAndDelete} leftIcon={<Trash size={20} />}>
      Delete
    </Button>
  );
}

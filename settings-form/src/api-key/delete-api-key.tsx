import { Button, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { Trash } from 'tabler-icons-react';
import { APICaller } from '../api-caller';
import { defaultStyles, IStyles } from './styles';
import { useTranslation } from 'react-i18next';

interface IDeleteAPIKey {
  id: string;
  name: string;
  onSuccess: () => void;
  styles?: IStyles;
}

export function DeleteAPIKey({ id, name, onSuccess, styles = defaultStyles }: IDeleteAPIKey) {
  const { t } = useTranslation();
  const modals = useModals();

  const doDelete = async () => {
    if (!id) {
      return;
    }
    showNotification({
      id: 'for-deleting',
      title: 'Pending',
      message: 'Deleting API Key...',
      loading: true,
      autoClose: false,
    });
    try {
      await APICaller.api_key.delete(id);
      updateNotification({
        id: 'for-deleting',
        title: 'Successful',
        message: `API Key [${name}] is deleted`,
        color: 'green',
        autoClose: true,
      });
      onSuccess();
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-deleting',
        title: 'Failed',
        message: error.message,
        color: 'red',
        autoClose: true,
      });
    }
  };

  const confirmAndDelete = () =>
    modals.openConfirmModal({
      title: t('api_key.delete'),
      labels: { confirm: t('common.actions.confirm'), cancel: t('common.actions.cancel') },
      onCancel: () => console.log('Cancel'),
      onConfirm: doDelete,
      cancelProps: {
        size: styles.button.size,
      },
      confirmProps: {
        color: 'red',
        size: styles.button.size,
      },
    });

  return (
    <Button size={styles.button.size} color="red" onClick={confirmAndDelete} leftIcon={<Trash size={20} />}>
      {t('common.actions.delete')}
    </Button>
  );
}

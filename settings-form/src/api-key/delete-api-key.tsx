import { Button } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { APICaller } from '../api-caller';
import { defaultStyles, IStyles } from './styles';

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
      title: t('common.state.pending'),
      message: t('global_sql_snippet.state.deleting'),
      loading: true,
      autoClose: false,
    });
    try {
      await APICaller.api_key.delete(id);
      updateNotification({
        id: 'for-deleting',
        title: t('common.state.successful'),
        message: t('global_sql_snippet.state.deleted', { name }),
        color: 'green',
        autoClose: true,
        loading: false,
      });
      onSuccess();
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-deleting',
        title: t('common.state.failed'),
        message: error.message,
        color: 'red',
        autoClose: true,
        loading: false,
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
    <Button size={styles.button.size} color="red" onClick={confirmAndDelete} leftSection={<IconTrash size={20} />}>
      {t('common.actions.delete')}
    </Button>
  );
}

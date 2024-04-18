import { Button, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { Trash } from 'tabler-icons-react';
import { APICaller } from '../api-caller';
import { defaultStyles, IStyles } from './styles';
import { useTranslation } from 'react-i18next';

interface IDeleteAccount {
  id: string;
  name: string;
  onSuccess: () => void;
  styles?: IStyles;
}

export function DeleteAccount({ id, name, onSuccess, styles = defaultStyles }: IDeleteAccount) {
  const { t } = useTranslation();
  const modals = useModals();

  const doDelete = async () => {
    if (!id) {
      return;
    }
    showNotification({
      id: 'for-deleting',
      title: t('settings.common.state.pending'),
      message: t('settings.account.state.deleting'),
      loading: true,
      autoClose: false,
    });
    try {
      await APICaller.account.delete(id);
      updateNotification({
        id: 'for-deleting',
        title: t('settings.common.state.successful'),
        message: t('settings.account.state.deleted', { name }),
        color: 'green',
        autoClose: true,
      });
      onSuccess();
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-deleting',
        title: t('settings.common.state.failed'),
        message: error.message,
        color: 'red',
        autoClose: true,
      });
    }
  };

  const confirmAndDelete = () =>
    modals.openConfirmModal({
      title: t('settings.account.delete'),
      labels: { confirm: t('settings.common.actions.confirm'), cancel: t('settings.common.actions.cancel') },
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
      {t('settings.common.actions.delete')}
    </Button>
  );
}

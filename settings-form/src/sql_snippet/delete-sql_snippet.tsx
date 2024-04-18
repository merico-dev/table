import { Button } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { Trash } from 'tabler-icons-react';
import { APICaller } from '../api-caller';
import { IStyles, defaultStyles } from './styles';
import { useTranslation } from 'react-i18next';

interface IDeleteSQLSnippet {
  id: string;
  onSuccess: () => void;
  styles?: IStyles;
}

export function DeleteSQLSnippet({ id, onSuccess, styles = defaultStyles }: IDeleteSQLSnippet) {
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
      await APICaller.sql_snippet.delete(id);
      updateNotification({
        id: 'for-deleting',
        title: t('common.state.successful'),
        message: t('global_sql_snippet.state.deleted', { name: id }),
        color: 'green',
        autoClose: true,
      });
      onSuccess();
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-deleting',
        title: t('common.state.failed'),
        message: error.message,
        color: 'red',
        autoClose: true,
      });
    }
  };

  const confirmAndDelete = () =>
    modals.openConfirmModal({
      title: t('global_sql_snippet.delete'),
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
      {t('common.actions.edit')}
    </Button>
  );
}

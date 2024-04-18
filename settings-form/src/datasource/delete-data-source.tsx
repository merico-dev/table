import { Button, Text, Tooltip } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconLock } from '@tabler/icons-react';
import { Trash } from 'tabler-icons-react';

import { APICaller } from '../api-caller';
import { defaultStyles, IStyles } from './styles';
import { useTranslation } from 'react-i18next';

interface IDeleteDataSource {
  id: string;
  name: string;
  onSuccess: () => void;
  styles?: IStyles;
  isProtected?: boolean;
}

export function DeleteDataSource({ id, name, isProtected, onSuccess, styles = defaultStyles }: IDeleteDataSource) {
  const { t } = useTranslation();
  const modals = useModals();

  const doDelete = async () => {
    if (!id) {
      return;
    }
    showNotification({
      id: 'for-deleting',
      title: t('common.state.pending'),
      message: t('datasource.state.deleting'),
      loading: true,
      autoClose: false,
    });
    await APICaller.datasource.delete(id);
    updateNotification({
      id: 'for-deleting',
      title: t('common.state.successful'),
      message: t('datasource.state.deleted', { name }),
      color: 'green',
      autoClose: true,
    });
    onSuccess();
  };

  const confirmAndDelete = () =>
    modals.openConfirmModal({
      title: t('datasource.delete.title'),
      children: <Text size={styles.size}>{t('datasource.delete.hint')}</Text>,
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

  if (isProtected) {
    return (
      <Tooltip
        withArrow
        events={{ hover: true, touch: false, focus: false }}
        label={t('datasource.delete.cant_delete_preset')}
      >
        <Button
          size={styles.button.size}
          color="gray"
          variant="light"
          leftIcon={<IconLock size={16} />}
          sx={{ transform: 'none !important' }}
        >
          {t('common.actions.delete')}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button size={styles.button.size} color="red" onClick={confirmAndDelete} leftIcon={<Trash size={16} />}>
      {t('common.actions.delete')}
    </Button>
  );
}

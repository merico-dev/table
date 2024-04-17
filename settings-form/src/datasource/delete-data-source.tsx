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
      title: t('settings.common.state.pending'),
      message: t('settings.datasource.state.deleting'),
      loading: true,
      autoClose: false,
    });
    await APICaller.datasource.delete(id);
    updateNotification({
      id: 'for-deleting',
      title: t('settings.common.state.successful'),
      message: t('settings.datasource.state.deleted', { name }),
      color: 'green',
      autoClose: true,
    });
    onSuccess();
  };

  const confirmAndDelete = () =>
    modals.openConfirmModal({
      title: t('settings.datasource.delete.title'),
      children: <Text size={styles.size}>{t('settings.datasource.delete.hint')}</Text>,
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

  if (isProtected) {
    return (
      <Tooltip
        withArrow
        events={{ hover: true, touch: false, focus: false }}
        label={t('settings.datasource.delete.cant_delete_preset')}
      >
        <Button
          size={styles.button.size}
          color="gray"
          variant="light"
          leftIcon={<IconLock size={16} />}
          sx={{ transform: 'none !important' }}
        >
          {t('settings.common.actions.delete')}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button size={styles.button.size} color="red" onClick={confirmAndDelete} leftIcon={<Trash size={16} />}>
      {t('settings.common.actions.delete')}
    </Button>
  );
}

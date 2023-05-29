import { Button, Text, Tooltip, useMantineTheme } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconLock } from '@tabler/icons';
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
  const theme = useMantineTheme();
  if (isProtected) {
    return (
      <Tooltip
        withArrow
        events={{ hover: true, touch: false, focus: false }}
        label="This is a preset datasource, it can not be deleted"
      >
        <span>
          <IconLock size={16} color={theme.colors.gray[7]} />
        </span>
      </Tooltip>
    );
  }

  return (
    <Button size={styles.button.size} color="red" onClick={confirmAndDelete} leftIcon={<Trash size={16} />}>
      Delete
    </Button>
  );
}

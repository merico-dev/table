import { Menu, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { IconTrash } from '@tabler/icons-react';
import { APICaller } from '../../../../../api-caller';
import { useDashboardStore } from '../../../models/dashboard-store-context';

export const DeleteDashboard = observer(({ id }: { id: string }) => {
  const modals = useModals();
  const navigate = useNavigate();
  const { store } = useDashboardStore();

  const doDelete = async () => {
    if (!id) {
      return;
    }
    showNotification({
      id: 'for-deleting',
      title: 'Pending',
      message: 'Deleting dashboard...',
      loading: true,
      autoClose: false,
    });
    await APICaller.dashboard.delete(id);
    updateNotification({
      id: 'for-deleting',
      title: 'Successful',
      message: 'Dashboard is deleted',
      color: 'green',
      autoClose: true,
    });
    navigate('/dashboard');
    store.load();
  };

  const confirmAndDelete = () =>
    modals.openConfirmModal({
      title: 'Delete this dashboard?',
      children: <Text size="sm">This action cannot be undone.</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: doDelete,
    });
  if (!id) {
    return null;
  }
  return (
    <Menu.Item color="red" leftSection={<IconTrash size={16} />} onClick={confirmAndDelete}>
      Delete this dashboard
    </Menu.Item>
  );
});

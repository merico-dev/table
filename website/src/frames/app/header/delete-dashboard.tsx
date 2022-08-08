import { Button, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash } from 'tabler-icons-react';
import { DashboardAPI } from '../../../api-caller/dashboard';

export function DeleteDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const modals = useModals();
  const doDelete = async () => {
    if (!id) {
      return;
    }
    showNotification({
      id: 'for-deleting',
      title: 'Pending',
      message: 'Deleting dashboard...',
      loading: true,
    });
    await DashboardAPI.delete(id);
    updateNotification({
      id: 'for-deleting',
      title: 'Successful',
      message: 'Dashboard is deleted',
      color: 'green',
    });
    navigate('/dashboard');
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
    <Button size="xs" color="red" onClick={confirmAndDelete} leftIcon={<Trash size={20} />}>
      Delete this dashboard
    </Button>
  );
}

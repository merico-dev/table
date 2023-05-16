import { useModals } from '@mantine/modals';
import { Button, Text } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { APICaller } from '../../../../api-caller';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';

interface IDeleteVersion {
  id: string;
  postSubmit: () => void;
}

export const DeleteVersion = observer(({ id, postSubmit }: IDeleteVersion) => {
  const { store } = useDashboardStore();
  const modals = useModals();
  const navigate = useNavigate();

  const doDelete = async () => {
    try {
      showNotification({
        id: 'for-deleting',
        title: 'Pending',
        message: 'Deleting version...',
        loading: true,
      });
      await APICaller.dashboard_content.delete({ id });
      updateNotification({
        id: 'for-deleting',
        title: 'Successful',
        message: 'Dashboard is deleted',
        color: 'green',
      });
      postSubmit();
      const defaultContentID = store.currentDetail?.content_id;
      navigate(`/dashboard/${store.currentID}/edit/${defaultContentID}`);

      if (defaultContentID) {
        store.currentDetail?.content.setID(defaultContentID);
      }
    } catch (error) {
      updateNotification({
        id: 'for-deleting',
        title: 'Failed',
        // @ts-expect-error type of error
        message: error.message,
        color: 'red',
      });
    }
  };

  const confirmAndDelete = () =>
    modals.openConfirmModal({
      title: 'Delete this version?',
      children: <Text size="sm">This action cannot be undone.</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: doDelete,
      zIndex: 400,
    });

  const isCurrentPublicVersion = store.currentDetail?.content_id === id;
  return (
    <Button size="xs" disabled={isCurrentPublicVersion} onClick={confirmAndDelete} color="red" variant="filled">
      Delete
    </Button>
  );
});

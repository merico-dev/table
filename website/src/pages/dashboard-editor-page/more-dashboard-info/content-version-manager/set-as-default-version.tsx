import { Button } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { observer } from 'mobx-react-lite';
import { APICaller } from '../../../../api-caller';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';

interface ISetAsDefaultVersion {
  id: string;
  postSubmit: () => void;
}

export const SetAsDefaultVersion = observer(({ id, postSubmit }: ISetAsDefaultVersion) => {
  const { store } = useDashboardStore();

  const setDefault = async () => {
    try {
      showNotification({
        id: 'for-updating',
        title: 'Pending',
        message: '',
        loading: true,
      });

      if (!store.currentDetail) {
        throw new Error('No current detail');
      }
      const d = store.currentDetail;
      await APICaller.dashboard.update({
        id: d.id,
        name: d.name,
        group: d.group,
        content_id: id,
      });

      updateNotification({
        id: 'for-updating',
        title: 'Successful',
        message: '',
        color: 'green',
      });
      store.setCurrentContentID(id);
      store.loadCurrentDetail();
      postSubmit();
    } catch (error) {
      updateNotification({
        id: 'for-updating',
        title: 'Failed',
        // @ts-expect-error type of error
        message: error.message,
        color: 'red',
      });
    }
  };

  const isDefaultVersion = store.currentDetail?.content_id === id;
  return (
    <Button size="xs" disabled={isDefaultVersion} onClick={setDefault} color="orange" variant="filled">
      Set as default version
    </Button>
  );
});

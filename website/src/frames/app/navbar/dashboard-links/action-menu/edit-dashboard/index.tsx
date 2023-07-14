import { Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useDashboardStore } from '../../../../models/dashboard-store-context';
import { EditDashboardForm } from './form';

export const EditDashboardModal = observer(
  ({ id, opened, close }: { id: string; opened: boolean; close: () => void }) => {
    const { store } = useDashboardStore();
    const dashboard = store.getByID(id);
    if (!id || !dashboard) {
      return null;
    }

    const postSubmit = () => {
      close();
      store.load();
    };
    return (
      <Modal
        opened={opened}
        onClose={close}
        title={`Edit Dashboard ${dashboard.name}`}
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <EditDashboardForm dashboard={dashboard} postSubmit={postSubmit} />
      </Modal>
    );
  },
);

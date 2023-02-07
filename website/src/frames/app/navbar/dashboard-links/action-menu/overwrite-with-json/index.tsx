import { Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useDashboardStore } from '../../../../models/dashboard-store-context';
import { OverwriteWithJSONForm } from './form';

export const OverwriteWithJSONModal = observer(
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
        overflow="inside"
        opened={opened}
        onClose={close}
        title="Overwrite with JSON file"
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <OverwriteWithJSONForm dashboard={dashboard} postSubmit={postSubmit} />
      </Modal>
    );
  },
);

import { Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { FilterSettings } from './filter-settings';

interface FilterSettingsModal {
  opened: boolean;
  close: () => void;
}

export const FilterSettingsModal = observer(function _FilterSettingsModal({ opened, close }: FilterSettingsModal) {
  return (
    <Modal
      size="96vw"
      opened={opened}
      onClose={close}
      title="Filters"
      trapFocus
      onDragStart={(e) => {
        e.stopPropagation();
      }}
      withCloseButton={false}
    >
      <FilterSettings />
    </Modal>
  );
});

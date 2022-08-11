import { AppShell, LoadingOverlay, Modal, Navbar, Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { LayoutStateContext } from '../../contexts/layout-state-context';
import { DashboardModelInstance } from '../../model';
import { FilterSettings } from './filter-settings';

interface FilterSettingsModal {
  opened: boolean;
  close: () => void;
  model: DashboardModelInstance;
}

export const FilterSettingsModal = observer(function _FilterSettingsModal({
  opened,
  close,
  model,
}: FilterSettingsModal) {
  const { freezeLayout } = React.useContext(LayoutStateContext);

  React.useEffect(() => {
    freezeLayout(opened);
  }, [opened]);

  return (
    <Modal
      size="96vw"
      overflow="inside"
      opened={opened}
      onClose={close}
      title="Filters"
      trapFocus
      onDragStart={(e) => {
        e.stopPropagation();
      }}
      withCloseButton={false}
    >
      <FilterSettings model={model} />
    </Modal>
  );
});

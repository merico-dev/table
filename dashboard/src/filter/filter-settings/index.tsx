import { AppShell, LoadingOverlay, Modal, Navbar, Tabs } from "@mantine/core";
import React from "react";
import { LayoutStateContext } from "../../contexts/layout-state-context";
import { IDashboardFilter } from "../../types";
import { FilterSettings } from "./filter-settings";

interface FilterSettingsModal {
  opened: boolean;
  close: () => void;
  filters: IDashboardFilter[];
  setFilters: (v: IDashboardFilter[]) => void;
}

export function FilterSettingsModal({ opened, close, filters, setFilters }: FilterSettingsModal) {
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
      title='Filters'
      trapFocus
      onDragStart={e => { e.stopPropagation() }}
    >
      <FilterSettings filters={filters} setFilters={setFilters} />
    </Modal>
  )
}
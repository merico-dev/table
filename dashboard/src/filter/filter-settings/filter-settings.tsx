import { AppShell, Group, LoadingOverlay, Modal, Navbar, Tabs } from "@mantine/core";
import React from "react";
import { LayoutStateContext } from "../../contexts/layout-state-context";
import { IDashboardFilter } from "../../types";

interface FilterSettings {
  filters: IDashboardFilter[];
  setFilters: (v: IDashboardFilter[]) => void;
}

export function FilterSettings({ filters, setFilters }: FilterSettings) {
  return (
    <Group direction="column" grow>
      <span>Filter Settings</span>
      <pre>{JSON.stringify(filters, null, 2)}</pre>
    </Group>
  )
}
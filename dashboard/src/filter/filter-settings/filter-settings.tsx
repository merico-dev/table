import { Group, Tabs } from "@mantine/core";
import { IDashboardFilter } from "../../types";

interface FilterSettings {
  filters: IDashboardFilter[];
  setFilters: (v: IDashboardFilter[]) => void;
}

export function FilterSettings({ filters, setFilters }: FilterSettings) {
  return (
    <Group direction="column" grow>
      <pre>{JSON.stringify(filters, null, 2)}</pre>
    </Group>
  )
}
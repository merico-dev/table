import { Group, Stack, Tabs } from "@mantine/core";
import { IDashboardFilter } from "../../types";

interface FilterSettings {
  filters: IDashboardFilter[];
  setFilters: (v: IDashboardFilter[]) => void;
}

export function FilterSettings({ filters, setFilters }: FilterSettings) {
  return (
    <Stack>
      <pre>{JSON.stringify(filters, null, 2)}</pre>
    </Stack>
  )
}
import { Box, Button, Group, Stack, Tabs } from "@mantine/core";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { DeviceFloppy, PlaylistAdd, Recycle } from "tabler-icons-react";
import { IDashboardFilter } from "../../types";
import { FilterSetting } from "./filter-setting";
import { IFilterSettingsForm } from "./types";

interface FilterSettings {
  filters: IDashboardFilter[];
  setFilters: (v: IDashboardFilter[]) => void;
}

export function FilterSettings({ filters, setFilters }: FilterSettings) {
  const { control, handleSubmit } = useForm<IFilterSettingsForm>({
    defaultValues: {
      filters: filters ?? []
    },
  })
  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: "filters",
  });
  return (
    <Group
      sx={{ height: '90vh', maxHeight: 'calc(100vh - 185px)' }}
      p={0}
    >
      <form onSubmit={handleSubmit(console.log)} style={{ height: '100%' }}>
        <Group sx={{ position: 'absolute', top: '16px', right: '16px' }}>
          <Button size="xs" color="green" leftIcon={<DeviceFloppy size={20} />}>Save Changes</Button>
          <Button size="xs" color="red" leftIcon={<Recycle size={20} />}>Revert Changes</Button>
        </Group>
        <Tabs orientation="vertical" defaultValue={fields[0]?.id}>
          <Group sx={{ height: '100%' }}>
            <Stack sx={{ height: '100%' }}>
              <Tabs.List position="left" sx={{ flexGrow: 1 }}>
                {fields.map((field, index) => (
                  <Tabs.Tab key={field.id} value={field.id}>{field.label}</Tabs.Tab>
                ))}
              </Tabs.List>
              <Button size="xs" color="blue" leftIcon={<PlaylistAdd size={20} />}>Add a Filter</Button>
            </Stack>
            <Box sx={{ flexGrow: 1, height: '100%' }}>
              {fields.map((field, index) => (
                <Tabs.Panel key={field.id} value={field.id}>
                  <FilterSetting field={field} index={index} control={control} />
                </Tabs.Panel>
              ))}
            </Box>
          </Group>
        </Tabs>
      </form>
    </Group>
  )
}
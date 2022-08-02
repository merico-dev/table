import { Box, Button, Group, Stack, Tabs } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { DeviceFloppy, PlaylistAdd, Recycle, Trash } from "tabler-icons-react";
import { IDashboardFilter } from "../../types";
import { FilterSetting } from "./filter-setting";
import { IFilterSettingsForm } from "./types";

interface FilterSettings {
  filters: IDashboardFilter[];
  setFilters: (v: IDashboardFilter[]) => void;
}

export function FilterSettings({ filters, setFilters }: FilterSettings) {
  const { control, handleSubmit, watch } = useForm<IFilterSettingsForm>({
    defaultValues: {
      filters: filters ?? []
    },
  })
  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: "filters",
  });

  const watchFieldArray = watch("filters");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    };
  });

  const addFilter = () => {
    const key = randomId()
    append({
      key,
      label: key,
      type: 'text-input',
      config: {
        required: false,
        default_value: '',
      },
    })
  }

  const removeFilter = (index: number) => {
    remove(index)
  }

  return (
    <Group
      sx={{ height: '90vh', maxHeight: 'calc(100vh - 185px)' }}
      p={0}
    >
      <form onSubmit={handleSubmit(console.log)} style={{ height: '100%', width: '100%' }}>
        <Group sx={{ position: 'absolute', top: '16px', right: '16px' }}>
          <Button size="xs" color="green" leftIcon={<DeviceFloppy size={20} />}>Save Changes</Button>
          <Button size="xs" color="red" leftIcon={<Recycle size={20} />}>Revert Changes</Button>
        </Group>
        <Tabs orientation="vertical" defaultValue={controlledFields[0]?.id}>
          <Group sx={{ height: '100%' }}>
            <Stack sx={{ height: '100%' }}>
              <Tabs.List position="left" sx={{ flexGrow: 1 }}>
                {controlledFields.map((field, index) => (
                  <Tabs.Tab key={field.id} value={field.id}>{field.label}</Tabs.Tab>
                ))}
              </Tabs.List>
              <Button size="xs" color="blue" leftIcon={<PlaylistAdd size={20} />} onClick={addFilter}>Add a Filter</Button>
            </Stack>
            <Box sx={{ flexGrow: 1, height: '100%' }}>
              {controlledFields.map((field, index) => (
                <Tabs.Panel key={field.id} value={field.id} sx={{ height: '100%' }}>
                  <Stack sx={{ height: '100%' }} spacing="sm">
                    <Box sx={{ flexGrow: 1, maxHeight: 'calc(100% - 52px)', overflow: 'scroll' }}>
                      <FilterSetting field={field} index={index} control={control} watch={watch} />
                    </Box>
                    <Group position="right" pt={10}>
                      <Button size="xs" color="red" leftIcon={<Trash size={20} />} onClick={() => removeFilter(index)}>Delete this filter</Button>
                    </Group>
                  </Stack>
                </Tabs.Panel>
              ))}
            </Box>
          </Group>
        </Tabs>
      </form>
    </Group>
  )
}
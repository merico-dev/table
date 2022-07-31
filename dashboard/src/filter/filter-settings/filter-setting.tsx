import { Box, Divider, Group, Select, SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import React from "react";
import { Control, Controller, FieldArrayWithId } from "react-hook-form";
import { FilterEditorTextInput } from "../filter-text-input/editor";
import { PreviewFilter } from "./preview-filter";
import { IFilterSettingsForm } from "./types";

const editors = {
  select: React.Fragment,
  'text-input': FilterEditorTextInput,
  'checkbox': React.Fragment,
  'date-time': React.Fragment,
}

const filterTypeOptions = [
  { label: 'Select', value: 'select' },
  { label: 'Text Input', value: 'text-input' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Date Time', value: 'date-time' },
]

interface IFilterSetting {
  field: FieldArrayWithId<IFilterSettingsForm, "filters", "id">;
  index: number;
  control: Control<IFilterSettingsForm, object>;
}

export function FilterSetting({ field, index, control }: IFilterSetting) {
  const FilterEditor = React.useMemo(() => {
    return editors[field.type]
  }, [field.type]);

  return (
    <SimpleGrid cols={2}>
      <Box>
        <Text pb="md" color="gray">Edit</Text>
        <Stack sx={{ maxWidth: '30em' }}>
          <Controller
            name={`filters.${index}.key`}
            control={control}
            render={({ field }) => (
              <TextInput label="Key" placeholder="A unique key to refer" required {...field} />
            )}
          />
          <Controller
            name={`filters.${index}.label`}
            control={control}
            render={({ field }) => (
              <TextInput label="Label" placeholder="Label for this field" required {...field} />
            )}
          />
          <Controller
            name={`filters.${index}.type`}
            control={control}
            render={({ field }) => (
              <Select label="Widget" data={filterTypeOptions} required {...field} />
            )}
          />
          <Divider label='Widget Settings' labelPosition="center" />
          <FilterEditor field={field} index={index} control={control}/>
        </Stack>
      </Box>
      <PreviewFilter filter={field} />
    </SimpleGrid>
  )
}
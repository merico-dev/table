import { Box, Select, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import React from 'react';
import { FilterModelInstance } from '../../model';
import { FilterEditorCheckbox } from '../filter-checkbox/editor';
import { FilterEditorDateRange } from '../filter-date-range/editor';
import { FilterEditorMultiSelect } from '../filter-multi-select/editor';
import { FilterEditorSelect } from '../filter-select/editor';
import { FilterEditorTextInput } from '../filter-text-input/editor';
import { PreviewFilter } from './preview-filter';

const editors = {
  select: FilterEditorSelect,
  'multi-select': FilterEditorMultiSelect,
  'text-input': FilterEditorTextInput,
  checkbox: FilterEditorCheckbox,
  'date-range': FilterEditorDateRange,
};

const filterTypeOptions = [
  { label: 'Select', value: 'select' },
  { label: 'Multi Select', value: 'multi-select' },
  { label: 'Text Input', value: 'text-input' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Date Range', value: 'date-range' },
];

interface IFilterSetting {
  filter: FilterModelInstance;
  index: number;
}

export function FilterSetting({ filter, index }: IFilterSetting) {
  const FilterEditor = React.useMemo(() => {
    return editors[filter.type];
  }, [filter.type]);

  return (
    <SimpleGrid cols={2}>
      <Box pl="md">
        <Text pb="md" color="gray">
          Edit
        </Text>
        <Stack sx={{ maxWidth: '30em' }}>
          <TextInput label="Placement Order" required value={filter.order} onChange={console.log} />
          <TextInput
            label="Key"
            placeholder="A unique key to refer"
            required
            value={filter.key}
            onChange={console.log}
          />
          <TextInput
            label="Label"
            placeholder="Label for this field"
            required
            value={filter.label}
            onChange={console.log}
          />
          <Select label="Widget" data={filterTypeOptions} required value={filter.type} onChange={console.log} />
          {/* @ts-expect-error */}
          <FilterEditor config={filter.config} index={index} />
        </Stack>
      </Box>
      <PreviewFilter filter={filter} />
    </SimpleGrid>
  );
}

import { Box, Checkbox, Divider, Group, MultiSelect, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useEditContentModelContext } from '~/contexts';
import { FilterMetaInstance } from '~/model';
import { FilterEditorCheckbox } from '../filter-checkbox/editor';
import { FilterEditorDateRange } from '../filter-date-range/editor';
import { FilterEditorMultiSelect } from '../filter-multi-select/editor';
import { FilterEditorSelect } from '../filter-select/editor';
import { FilterEditorTextInput } from '../filter-text-input/editor';
import { FilterEditorTreeSelect } from '../filter-tree-select/editor';
import { PreviewFilter } from './preview-filter';

const editors = {
  select: FilterEditorSelect,
  'multi-select': FilterEditorMultiSelect,
  'tree-select': FilterEditorTreeSelect,
  'text-input': FilterEditorTextInput,
  checkbox: FilterEditorCheckbox,
  'date-range': FilterEditorDateRange,
};

export const filterTypeNames = {
  select: 'Select',
  'multi-select': 'Multi Select',
  'tree-select': 'Tree Select',
  'text-input': 'Text Input',
  checkbox: 'Checkbox',
  'date-range': 'Date Range',
};

const filterTypeOptions = [
  { label: filterTypeNames['select'], value: 'select' },
  { label: filterTypeNames['multi-select'], value: 'multi-select' },
  { label: filterTypeNames['tree-select'], value: 'tree-select' },
  { label: filterTypeNames['text-input'], value: 'text-input' },
  { label: filterTypeNames['checkbox'], value: 'checkbox' },
  { label: filterTypeNames['date-range'], value: 'date-range' },
];

interface IFilterSetting {
  filter: FilterMetaInstance;
}

export const FilterSetting = observer(function _FilterSetting({ filter }: IFilterSetting) {
  const model = useEditContentModelContext();
  const FilterEditor = React.useMemo(() => {
    return editors[filter.type];
  }, [filter.type]);

  return (
    <Group grow spacing={20} align="top">
      <Box sx={{ maxWidth: '600px' }}>
        <Text pb="md" color="gray">
          Edit
        </Text>
        <Stack>
          <Group noWrap>
            <NumberInput
              label="Placement Order"
              required
              value={filter.order}
              onChange={filter.setOrder}
              hideControls
              // @ts-expect-error important
              sx={{ flexGrow: '1 !important' }}
            />
            {filter.auto_submit_supported && (
              <Checkbox
                label="Submit automatically"
                checked={filter.auto_submit}
                onChange={(e) => filter.setAutoSubmit(e.currentTarget.checked)}
                mt={22}
              />
            )}
          </Group>
          <MultiSelect
            label="Visible in..."
            data={model.views.options}
            value={[...filter.visibleInViewsIDs]}
            onChange={filter.setVisibleInViewsIDs}
          />
          <TextInput
            label="Key"
            placeholder="A unique key to refer"
            required
            value={filter.key}
            onChange={(e) => {
              filter.setKey(e.currentTarget.value);
            }}
          />
          <TextInput
            label="Label"
            placeholder="Label for this field"
            required
            value={filter.label}
            onChange={(e) => {
              filter.setLabel(e.currentTarget.value);
            }}
          />
          <Select
            label="Widget"
            data={filterTypeOptions}
            required
            value={filter.type}
            onChange={filter.setType}
            maxDropdownHeight={500}
          />
          <Divider
            mb={0}
            mt={10}
            variant="dashed"
            label={`${filterTypeNames[filter.type]} Settings`}
            labelPosition="center"
          />
          {/* @ts-expect-error type mismatch */}
          <FilterEditor config={filter.config} />
        </Stack>
      </Box>
      <PreviewFilter filter={filter} />
    </Group>
  );
});

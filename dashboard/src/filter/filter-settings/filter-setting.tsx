import {
  Box,
  Checkbox,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  Flex,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useModelContext } from '~/contexts';
import { FilterModelInstance } from '../../model';
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

const filterTypeOptions = [
  { label: 'Select', value: 'select' },
  { label: 'Multi Select', value: 'multi-select' },
  { label: 'Tree Select', value: 'tree-select' },
  { label: 'Text Input', value: 'text-input' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Date Range', value: 'date-range' },
];

interface IFilterSetting {
  filter: FilterModelInstance;
}

export const FilterSetting = observer(function _FilterSetting({ filter }: IFilterSetting) {
  const model = useModelContext();
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
          <Select label="Widget" data={filterTypeOptions} required value={filter.type} onChange={filter.setType} />
          {/* @ts-expect-error type mismatch */}
          <FilterEditor config={filter.config} />
        </Stack>
      </Box>
      <PreviewFilter filter={filter} />
    </Group>
  );
});

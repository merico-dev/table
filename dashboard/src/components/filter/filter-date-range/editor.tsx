import { Checkbox, Group, NumberInput, Select, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { FilterDateRangeConfigInstance, FilterMetaInstance } from '~/model';
import { FilterDateRange } from './render';
import { useMemo } from 'react';
import { getDateRangeShortcuts } from './widget/shortcuts/shortcuts';
import { CustomDefaultValueEditor } from '../custom-default-value-editor';

interface IFilterEditorDateRange {
  filter: FilterMetaInstance;
}

const inputFormatOptions = [
  { label: '2022', value: 'YYYY' },
  { label: '202201', value: 'YYYYMM' },
  { label: '20220101', value: 'YYYYMMDD' },
  { label: '2022-01', value: 'YYYY-MM' },
  { label: '2022-01-01', value: 'YYYY-MM-DD' },
];

export const FilterEditorDateRange = observer(function _FilterEditorDateRange({ filter }: IFilterEditorDateRange) {
  const config = filter.config as FilterDateRangeConfigInstance;

  const shortcuts = useMemo(
    () => getDateRangeShortcuts().map(({ value, group }) => ({ label: value, value, group })),
    [],
  );
  return (
    <>
      <Group>
        <Checkbox
          checked={config.required}
          onChange={(e) => config.setRequired(e.currentTarget.checked)}
          label="Required"
        />
        <Checkbox
          checked={config.allowSingleDateInRange}
          onChange={(e) => config.setAllowSingleDateInRange(e.currentTarget.checked)}
          label="Allow choosing 1 day"
        />
      </Group>
      <Group grow>
        <Select
          data={inputFormatOptions}
          label="Display Format"
          value={config.inputFormat}
          onChange={config.setInputFormat}
        />
        <NumberInput label="Max Days" min={0} value={config.max_days} onChange={config.setMaxDays} hideControls />
      </Group>
      <Group>
        <FilterDateRange
          label="Default Value"
          config={config}
          // @ts-expect-error type of default_value
          value={config.default_value}
          onChange={config.setDefaultValue}
          disabled={!!config.default_shortcut}
        />
        <Select
          data={shortcuts}
          label="Default by Shortcut"
          value={config.default_shortcut}
          onChange={config.setDefaultShortcut}
          placeholder="Priors default value"
          clearable
          sx={{ flexGrow: 1 }}
          maxDropdownHeight={500}
        />
      </Group>
      <CustomDefaultValueEditor filter={filter} />
    </>
  );
});

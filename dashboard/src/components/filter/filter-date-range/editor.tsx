import { Checkbox, Group, NumberInput, Select, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { FilterDateRangeConfigInstance } from '~/model';
import { FilterDateRange } from './render';

interface IFilterEditorDateRange {
  config: FilterDateRangeConfigInstance;
}

const inputFormatOptions = [
  { label: '2022', value: 'YYYY' },
  { label: '202201', value: 'YYYYMM' },
  { label: '20220101', value: 'YYYYMMDD' },
  { label: '2022-01', value: 'YYYY-MM' },
  { label: '2022-01-01', value: 'YYYY-MM-DD' },
];

export const FilterEditorDateRange = observer(function _FilterEditorDateRange({ config }: IFilterEditorDateRange) {
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
      <Select
        data={inputFormatOptions}
        label="Display Format"
        value={config.inputFormat}
        onChange={config.setInputFormat}
      />
      <FilterDateRange
        label="Default Value"
        config={config}
        // @ts-expect-error type of default_value
        value={config.default_value}
        onChange={config.setDefaultValue}
      />
      <NumberInput
        label="Max Days"
        min={0}
        value={config.max_days}
        onChange={config.setMaxDays}
        hideControls
        sx={{ width: '149px' }}
      />
    </>
  );
});

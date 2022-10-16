import { Checkbox, Group, Select } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { IFilterConfig_DateRange } from '../../model/filters/filter/date-range';
import { FilterDateRange } from './render';

interface IFilterEditorDateRange {
  config: IFilterConfig_DateRange;
}

const inputFormatOptions = [
  { label: '2022', value: 'YYYY' },
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
          checked={config.clearable}
          onChange={(e) => config.setClearable(e.currentTarget.checked)}
          label="Clearable"
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
        value={config.default_value}
        onChange={config.setDefaultValue}
      />
    </>
  );
});

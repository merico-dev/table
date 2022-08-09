import { Checkbox, Group, Select } from '@mantine/core';
import { IFilterConfig_DateRange } from '../../model/filter/date-range';

interface IFilterEditorDateRange {
  config: IFilterConfig_DateRange;
}

const inputFormatOptions = [
  { label: '2022', value: 'YYYY' },
  { label: '2022-01', value: 'YYYY-MM' },
  { label: '2022-01-01', value: 'YYYY-MM-DD' },
];

export function FilterEditorDateRange({ config }: IFilterEditorDateRange) {
  return (
    <>
      <Group>
        <Checkbox checked={config.required} onChange={(e) => console.log(e.currentTarget.checked)} label="Required" />
        <Checkbox checked={config.clearable} onChange={(e) => console.log(e.currentTarget.checked)} label="Clearable" />
      </Group>
      <Select data={inputFormatOptions} label="Display Format" value={config.inputFormat} onChange={console.log} />
    </>
  );
}

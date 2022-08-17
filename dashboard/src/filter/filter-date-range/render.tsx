import { DateRangePicker } from '@mantine/dates';
import { Calendar } from 'tabler-icons-react';
import { FilterModelInstance } from '../../model';
import { IFilterConfig_DateRange } from '../../model/filters/filter/date-range';

interface IFilterDateRange extends Omit<FilterModelInstance, 'key' | 'type' | 'config'> {
  config: IFilterConfig_DateRange;
  value: any;
  onChange: (v: any) => void;
}

export function FilterDateRange({ label, config, value, onChange }: IFilterDateRange) {
  return (
    <DateRangePicker
      label={label}
      value={value}
      onChange={onChange}
      icon={<Calendar size={16} />}
      sx={{ minWidth: '14em' }}
      {...config}
    />
  );
}

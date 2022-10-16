import { DateRangePicker } from '@mantine/dates';
import { Calendar } from 'tabler-icons-react';
import { IFilterConfig_DateRange } from '../../model/filters/filter/date-range';

interface IFilterDateRange {
  label: string;
  config: IFilterConfig_DateRange;
  value: $TSFixMe;
  onChange: (v: $TSFixMe) => void;
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

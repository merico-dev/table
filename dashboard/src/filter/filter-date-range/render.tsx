import { DateRangePicker } from '@mantine/dates';
import { Calendar } from 'tabler-icons-react';
import { IDashboardFilter, IFilterConfig_DateRange } from '../../types';

interface IFilterDateRange extends Omit<IDashboardFilter, 'type' | 'config'> {
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

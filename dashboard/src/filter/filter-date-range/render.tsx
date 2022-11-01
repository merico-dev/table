import { DateRangePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { Calendar } from 'tabler-icons-react';
import { IFilterConfig_DateRange, TDateRangePickerValue } from '../../model/filters/filter/date-range';

interface IFilterDateRange {
  label: string;
  config: IFilterConfig_DateRange;
  value: TDateRangePickerValue;
  onChange: (v: $TSFixMe) => void;
}

export const FilterDateRange = observer(({ label, config, value = [null, null], onChange }: IFilterDateRange) => {
  const formattedValue = Array.isArray(value)
    ? (value.map((v) => (v ? dayjs(v).toDate() : null)) as [Date | null, Date | null])
    : [null, null];
  const handleChange = (values: [Date | null, Date | null]) => {
    onChange(values.map((d) => (d ? dayjs(d).format(config.inputFormat) : d)));
  };
  return (
    <DateRangePicker
      label={label}
      value={formattedValue}
      onChange={handleChange}
      icon={<Calendar size={16} />}
      sx={{ minWidth: '16em' }}
      {...config}
    />
  );
});

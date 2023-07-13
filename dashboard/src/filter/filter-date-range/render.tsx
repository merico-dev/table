import { DatePickerInput } from '@mantine/dates';
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
  const minDate = config.getMinDate(formattedValue[0]);
  const maxDate = config.getMaxDate(formattedValue[0]);
  return (
    <DatePickerInput
      type="range"
      label={label}
      // @ts-expect-error value's type
      value={formattedValue}
      onChange={handleChange}
      icon={<Calendar size={16} />}
      sx={{ minWidth: '16em' }}
      minDate={minDate}
      maxDate={maxDate}
      styles={{
        input: {
          borderColor: '#e9ecef',
        },
      }}
      {...config}
    />
  );
});

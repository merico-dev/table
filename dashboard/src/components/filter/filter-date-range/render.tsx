import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { Calendar } from 'tabler-icons-react';
import { FilterDateRangeConfigInstance, TDateRangePickerValue } from '~/model';

interface IFilterDateRange {
  label: string;
  config: FilterDateRangeConfigInstance;
  value: TDateRangePickerValue;
  onChange: (v: $TSFixMe) => void;
}

export const FilterDateRange = observer(({ label, config, value = [null, null], onChange }: IFilterDateRange) => {
  const { inputFormat, ...restConfig } = config;

  const formattedValue = Array.isArray(value)
    ? (value.map((v) => (v ? dayjs(v).toDate() : null)) as [Date | null, Date | null])
    : [null, null];
  const handleChange = (values: [Date | null, Date | null]) => {
    onChange(values.map((d) => (d ? dayjs(d).format(inputFormat) : d)));
  };
  return (
    <DatePickerInput
      type="range"
      label={label}
      // @ts-expect-error value's type
      value={formattedValue}
      onChange={handleChange}
      icon={<Calendar size={16} />}
      sx={{ minWidth: '16em' }}
      valueFormat={inputFormat}
      styles={{
        input: {
          borderColor: '#e9ecef',
        },
      }}
      {...restConfig}
    />
  );
});

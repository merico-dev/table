import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { FilterDateRangeConfigInstance, TDateRangePickerValue } from '~/model';
import { DateRangeWidget } from './widget';
import { DateRangeValue } from './widget/type';

interface IFilterDateRange {
  label: string;
  config: FilterDateRangeConfigInstance;
  value: TDateRangePickerValue;
  onChange: (v: $TSFixMe) => void;
}

export const FilterDateRange = observer(({ label, config, value = [null, null], onChange }: IFilterDateRange) => {
  const { inputFormat, required, max_days, allowSingleDateInRange } = config;

  const formattedValue: DateRangeValue = Array.isArray(value)
    ? (value.map((v) => (v ? dayjs(v).toDate() : null)) as DateRangeValue)
    : [null, null];
  const handleChange = (values: DateRangeValue) => {
    onChange(values.map((d) => (d ? dayjs(d).format(inputFormat) : d)));
  };
  return (
    <DateRangeWidget
      label={label}
      value={formattedValue}
      onChange={handleChange}
      inputFormat={inputFormat}
      allowSingleDateInRange={allowSingleDateInRange}
      max_days={max_days}
      required={required}
    />
  );
});

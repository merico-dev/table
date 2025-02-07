import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { DateRangeValue, FilterDateRangeConfigInstance } from '~/model';
import { DateRangeWidget } from './widget';
import { getDateRangeShortcutValue } from './widget/shortcuts/shortcuts';

interface IFilterDateRange {
  label: string;
  config: FilterDateRangeConfigInstance;
  value: DateRangeValue;
  onChange: (v: DateRangeValue) => void;
  disabled?: boolean;
}
const fallbackValue: DateRangeValue = {
  value: [null, null],
  shortcut: null,
};

export const formatDateRangeValue = (value: DateRangeValue) => {
  const valueFromShortcut = getDateRangeShortcutValue(value.shortcut);
  if (valueFromShortcut) {
    return valueFromShortcut;
  }
  if (Array.isArray(value.value)) {
    return value;
  }
  return fallbackValue;
};

const useFormattedDateRangeValue = (value: DateRangeValue) => {
  const formattedValue: DateRangeValue = useMemo(() => formatDateRangeValue(value), [value]);
  return formattedValue;
};
export const FilterDateRange = observer(
  ({ label, config, value = fallbackValue, onChange, disabled }: IFilterDateRange) => {
    const { inputFormat, required, max_days, allowSingleDateInRange } = config;
    const formattedValue = useFormattedDateRangeValue(value);

    return (
      <DateRangeWidget
        label={label}
        value={formattedValue}
        onChange={onChange}
        inputFormat={inputFormat}
        allowSingleDateInRange={allowSingleDateInRange}
        max_days={max_days}
        required={required}
        disabled={disabled}
      />
    );
  },
);

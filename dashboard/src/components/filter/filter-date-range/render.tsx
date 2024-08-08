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
}
const fallbackValue: DateRangeValue = {
  value: [null, null],
  shortcut: null,
};

export const FilterDateRange = observer(({ label, config, value = fallbackValue, onChange }: IFilterDateRange) => {
  const { inputFormat, required, max_days, allowSingleDateInRange } = config;

  const formattedValue: DateRangeValue = useMemo(() => {
    const valueFromShortcut = getDateRangeShortcutValue(value.shortcut);
    if (valueFromShortcut) {
      return valueFromShortcut;
    }
    if (Array.isArray(value.value)) {
      return value;
    }
    return fallbackValue;
  }, [value]);

  return (
    <DateRangeWidget
      label={label}
      value={formattedValue}
      onChange={onChange}
      inputFormat={inputFormat}
      allowSingleDateInRange={allowSingleDateInRange}
      max_days={max_days}
      required={required}
    />
  );
});

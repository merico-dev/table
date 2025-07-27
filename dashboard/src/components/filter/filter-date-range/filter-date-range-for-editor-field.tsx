import { useMemo } from 'react';
import { DateRangeValue } from '~/model';
import { DateRangeWidget } from './widget';
import { getDateRangeShortcutValue } from './widget/shortcuts/shortcuts';

type Props = {
  label: string;
  value: DateRangeValue;
  onChange: (v: DateRangeValue) => void;
  disabled?: boolean;
  inputFormat: string;
  required: boolean;
  max_days: number;
};
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

export const FilterDateRangeForEditorField = ({
  label,
  value = fallbackValue,
  onChange,
  disabled,
  inputFormat,
  required,
  max_days,
}: Props) => {
  const formattedValue = useFormattedDateRangeValue(value);

  return (
    <DateRangeWidget
      label={label}
      value={formattedValue}
      onChange={onChange}
      inputFormat={inputFormat}
      allowSingleDateInRange
      max_days={max_days}
      required={required}
      disabled={disabled}
    />
  );
};

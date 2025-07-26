import { useMemo } from 'react';
import { MericoDateRangeValue } from '~/model';
import { MericoDateRangeWidget } from './widget';
import { getMericoDateRangeShortcutValue } from './widget/shortcuts/shortcuts';

type Props = {
  label: string;
  value: MericoDateRangeValue;
  onChange: (v: MericoDateRangeValue) => void;
  inputFormat: string;
  required: boolean;
};
const fallbackValue: MericoDateRangeValue = {
  value: [null, null],
  shortcut: null,
  step: 'day',
};

export const formatDateRangeValue = (value: MericoDateRangeValue) => {
  const valueFromShortcut = getMericoDateRangeShortcutValue(value.shortcut, value.step);
  if (valueFromShortcut) {
    return valueFromShortcut;
  }
  if (Array.isArray(value.value)) {
    return value;
  }
  return fallbackValue;
};

const useFormattedDateRangeValue = (value: MericoDateRangeValue) => {
  const formattedValue: MericoDateRangeValue = useMemo(() => formatDateRangeValue(value), [value]);
  return formattedValue;
};

export const FilterMericoDateRangeForEditorField = ({
  label,
  value = fallbackValue,
  onChange,
  disabled,
  inputFormat,
  required,
}: Props) => {
  const formattedValue = useFormattedDateRangeValue(value);

  return (
    <MericoDateRangeWidget
      label={label}
      value={formattedValue}
      onChange={onChange}
      inputFormat={inputFormat}
      required={required}
    />
  );
};

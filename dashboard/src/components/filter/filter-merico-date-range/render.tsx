import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { FilterMericoDateRangeConfigInstance, MericoDateRangeValue } from '~/model';
import { MericoDateRangeWidget } from './widget';
import { getMericoDateRangeShortcutValue } from './widget/shortcuts/shortcuts';

type Props = {
  label: string;
  config: FilterMericoDateRangeConfigInstance;
  value: MericoDateRangeValue;
  onChange: (v: MericoDateRangeValue) => void;
  disabled?: boolean;
};
const fallbackValue: MericoDateRangeValue = {
  value: [null, null],
  shortcut: null,
  step: 'day',
};

export const formatMericoDateRangeValue = (value: MericoDateRangeValue) => {
  const valueFromShortcut = getMericoDateRangeShortcutValue(value.shortcut, value.step);
  if (valueFromShortcut) {
    return valueFromShortcut;
  }
  if (Array.isArray(value.value)) {
    return value;
  }
  return fallbackValue;
};

const useFormattedMericoDateRangeValue = (value: MericoDateRangeValue) => {
  const formattedValue: MericoDateRangeValue = useMemo(() => formatMericoDateRangeValue(value), [value]);
  return formattedValue;
};
export const FilterMericoDateRange = observer(({ label, config, value = fallbackValue, onChange, disabled }: Props) => {
  const { inputFormat, required, allowSingleDateInRange } = config;
  const formattedValue = useFormattedMericoDateRangeValue(value);

  return (
    <MericoDateRangeWidget
      label={label}
      value={formattedValue}
      onChange={onChange}
      inputFormat={inputFormat}
      allowSingleDateInRange={allowSingleDateInRange}
      required={required}
      disabled={disabled}
    />
  );
});

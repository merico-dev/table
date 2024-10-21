import { RangeSlider, Stack } from '@mantine/core';
import { forwardRef, useCallback, useState } from 'react';

type PropValue = [string, string];
type LocalValue = [number, number];

function propValueToLocalValue(value: PropValue): LocalValue {
  const [inner, outer] = value;
  return [Number(inner.replace('%', '')), Number(outer.replace('%', ''))];
}

function localValueToPropValue(value: LocalValue): PropValue {
  const [inner, outer] = value;
  return [Number.isFinite(inner) ? `${inner}%` : '', Number.isFinite(outer) ? `${outer}%` : ''];
}

type Props = {
  value: PropValue;
  onChange: (v: PropValue) => void;
  label: string;
};
export const RadiusSlider = forwardRef(({ label, value, onChange }: Props, ref) => {
  const [loc, setLoc] = useState<LocalValue>(propValueToLocalValue(value));

  const handleChange = useCallback(
    (v: LocalValue) => {
      onChange(localValueToPropValue(v));
    },
    [onChange],
  );

  return (
    <Stack gap={4} mt={2} mb="1rem">
      <label className="form-field-label required">{label}</label>
      <RangeSlider
        value={loc}
        onChange={setLoc}
        onChangeEnd={handleChange}
        label={(v) => {
          return `${v}%`;
        }}
      />
    </Stack>
  );
});

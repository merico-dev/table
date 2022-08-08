import { Select, Sx } from '@mantine/core';
import { ValueType } from './type';

const valueTypes = Object.values(ValueType).map((v) => ({ label: v, value: v }));

interface IValueTypeSelector {
  label: string;
  value: string;
  onChange: (value: string) => void;
  sx?: Sx;
}

export function ValueTypeSelector({ label, value, onChange, sx }: IValueTypeSelector) {
  return <Select label={label} data={valueTypes} value={value} onChange={onChange} sx={sx} />;
}

import { Select } from '@mantine/core';
import { forwardRef } from 'react';
import { StaticScatterSizeField } from './static';
import { DEFAULT_SCATTER_SIZE, TScatterSize } from './types';

const typeOptions = [
  {
    label: 'Static',
    value: 'static',
  },
  {
    label: 'Interpolation',
    value: 'interpolation',
  },
];

interface IScatterSizeSelect {
  label?: string;
  value: TScatterSize;
  onChange: (v: TScatterSize) => void;
}

export const ScatterSizeSelect = forwardRef<HTMLInputElement, IScatterSizeSelect>(
  ({ label = 'Size', value, onChange }: IScatterSizeSelect, ref) => {
    const changeType = (type: 'static' | 'interpolation') => {
      onChange({ ...DEFAULT_SCATTER_SIZE[type] });
    };
    return (
      <>
        <Select ref={ref} label={label} data={typeOptions} value={value.type} onChange={changeType} />
        <StaticScatterSizeField value={value} onChange={onChange} />
      </>
    );
  },
);

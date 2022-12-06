import { Group, Select, SimpleGrid } from '@mantine/core';
import { forwardRef } from 'react';
import { InterpolationScatterSizeField } from './interpolation';
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
      <SimpleGrid cols={2}>
        <Select
          ref={ref}
          label={label}
          data={typeOptions}
          value={value.type}
          onChange={changeType}
          sx={{ flexGrow: 1 }}
        />
        <StaticScatterSizeField value={value} onChange={onChange} />
        <InterpolationScatterSizeField value={value} onChange={onChange} />
      </SimpleGrid>
    );
  },
);

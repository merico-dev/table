import { Select, SimpleGrid } from '@mantine/core';
import { forwardRef } from 'react';
import { AnyObject } from '~/types';
import { DynamicScatterSizeField } from './dynamic';
import { StaticScatterSizeField } from './static';
import { DEFAULT_SCATTER_SIZE, TScatterSize } from './types';

const typeOptions = [
  {
    label: 'Static',
    value: 'static',
  },
  {
    label: 'Dynamic',
    value: 'dynamic',
  },
];

interface IScatterSizeSelect {
  label?: string;
  value: TScatterSize;
  onChange: (v: TScatterSize) => void;
  data: AnyObject[];
}

export const ScatterSizeSelect = forwardRef<HTMLInputElement, IScatterSizeSelect>(
  ({ label = 'Size', value, onChange, data }: IScatterSizeSelect, ref) => {
    const changeType = (type: 'static' | 'dynamic') => {
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
        <DynamicScatterSizeField value={value} onChange={onChange} data={data} />
      </SimpleGrid>
    );
  },
);

import { Select, SimpleGrid } from '@mantine/core';
import { forwardRef } from 'react';
import { DynamicScatterSizeField } from './dynamic';
import { StaticNumberField } from './static';
import { DEFAULT_VALUE, TNumberOrDynamic } from '../types';

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

interface IProps {
  label?: string;
  value: TNumberOrDynamic;
  onChange: (v: TNumberOrDynamic) => void;
}

export const NumberOrDynamicValue = forwardRef<HTMLInputElement, IProps>(
  ({ label = 'Size', value, onChange }: IProps, ref) => {
    const changeType = (type: 'static' | 'dynamic') => {
      onChange({ ...DEFAULT_VALUE[type] });
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
        <StaticNumberField value={value} onChange={onChange} />
        <DynamicScatterSizeField value={value} onChange={onChange} />
      </SimpleGrid>
    );
  },
);

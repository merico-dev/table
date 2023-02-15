import { Select, SimpleGrid } from '@mantine/core';
import { forwardRef } from 'react';
import { AnyObject } from '~/types';
import { DynamicSeriesColorField } from './dynamic';
import { StaticScatterSizeField } from './static';
import { DEFAULT_SERIES_COLOR, TSeriesColor } from './types';

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

interface ISeriesColorSelect {
  label?: string;
  value: TSeriesColor;
  onChange: (v: TSeriesColor) => void;
  data: AnyObject[];
}

export const SeriesColorSelect = forwardRef<HTMLInputElement, ISeriesColorSelect>(
  ({ label = 'Size', value, onChange, data }: ISeriesColorSelect, ref) => {
    const changeType = (type: 'static' | 'dynamic') => {
      onChange({ ...DEFAULT_SERIES_COLOR[type] });
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
        <DynamicSeriesColorField value={value} onChange={onChange} data={data} />
      </SimpleGrid>
    );
  },
);

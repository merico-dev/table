import { Select, SimpleGrid } from '@mantine/core';
import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DynamicScatterSizeField } from './dynamic';
import { StaticScatterSizeField } from './static';
import { DEFAULT_SCATTER_SIZE, TScatterSize } from './types';

interface IScatterSizeSelect {
  label?: string;
  value: TScatterSize;
  onChange: (v: TScatterSize) => void;
}

export const ScatterSizeSelect = forwardRef<HTMLInputElement, IScatterSizeSelect>(
  ({ label = 'Size', value, onChange }: IScatterSizeSelect, ref) => {
    const { t, i18n } = useTranslation();

    const typeOptions = useMemo(
      () => [
        {
          label: t('chart.symbol_size.static'),
          value: 'static',
        },
        {
          label: t('chart.symbol_size.dynamic'),
          value: 'dynamic',
        },
      ],
      [i18n.language],
    );

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
        <DynamicScatterSizeField value={value} onChange={onChange} />
      </SimpleGrid>
    );
  },
);

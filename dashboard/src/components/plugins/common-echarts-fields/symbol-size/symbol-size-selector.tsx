import { Select, SimpleGrid } from '@mantine/core';
import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DynamicSymbolSizeField } from './dynamic';
import { StaticSymbolSizeField } from './static';
import { DEFAULT_SCATTER_SIZE, SymbolSize } from './types';

interface ISymbolSizeSelect {
  label?: string;
  value: SymbolSize;
  onChange: (v: SymbolSize) => void;
}

export const SymbolSizeSelector = forwardRef<HTMLInputElement, ISymbolSizeSelect>(
  ({ label, value, onChange }: ISymbolSizeSelect, ref) => {
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
          label={label ?? t('chart.symbol_size.label')}
          data={typeOptions}
          value={value.type}
          onChange={changeType}
          sx={{ flexGrow: 1 }}
        />
        <StaticSymbolSizeField value={value} onChange={onChange} />
        <DynamicSymbolSizeField value={value} onChange={onChange} />
      </SimpleGrid>
    );
  },
);

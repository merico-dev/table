import { Select, SimpleGrid } from '@mantine/core';
import { forwardRef, useMemo } from 'react';
import { DynamicSeriesColorField } from './dynamic';
import { StaticSeriesColorField } from './static';
import { DEFAULT_SERIES_COLOR, TSeriesColor } from './types';
import { useTranslation } from 'react-i18next';

interface ISeriesColorSelect {
  label?: string;
  value: TSeriesColor;
  onChange: (v: TSeriesColor) => void;
}

export const SeriesColorSelect = forwardRef<HTMLInputElement, ISeriesColorSelect>(
  ({ label = 'Color', value, onChange }: ISeriesColorSelect, ref) => {
    const { t, i18n } = useTranslation();

    const typeOptions = useMemo(
      () => [
        {
          label: t('viz.scatter_chart.color.type.static'),
          value: 'static',
        },
        {
          label: t('viz.scatter_chart.color.type.dynamic'),
          value: 'dynamic',
        },
      ],
      [i18n.language],
    );
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
        <StaticSeriesColorField value={value} onChange={onChange} />
        <DynamicSeriesColorField value={value} onChange={onChange} />
      </SimpleGrid>
    );
  },
);

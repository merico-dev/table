import { Select } from '@mantine/core';
import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SeriesOrder } from './types';

type Props = {
  label: string;
  value?: SeriesOrder;
  onChange: (v: SeriesOrder) => void;
  hiddenValues?: SeriesOrder[];
};

export const SeriesOrderSelector = forwardRef<HTMLInputElement, Props>(
  ({ label, value, onChange, hiddenValues }, ref) => {
    const { t, i18n } = useTranslation();
    const options = useMemo(() => {
      let ret: { label: string; value: SeriesOrder }[] = [
        { label: t('chart.series_order.name'), value: 'name' },
        { label: t('chart.series_order.value'), value: 'value' },
        { label: t('chart.series_order.raw'), value: '' },
      ];
      if (hiddenValues && Array.isArray(hiddenValues) && hiddenValues.length > 0) {
        const s = new Set(hiddenValues);
        ret = ret.filter((r) => !s.has(r.value));
      }
      return ret;
    }, [i18n.language, hiddenValues]);

    // @ts-expect-error null value from onChange
    return <Select ref={ref} label={label} data={options} value={value} onChange={onChange} />;
  },
);

import { Group, SegmentedControl, Select } from '@mantine/core';
import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SeriesOrder } from './types';

type Props = {
  label: string;
  value: SeriesOrder;
  onChange: (v: SeriesOrder) => void;
  hiddenKeys?: SeriesOrder['key'][];
};

export const SeriesOrderSelector = forwardRef<HTMLInputElement, Props>(
  ({ label, value, onChange, hiddenKeys }, ref) => {
    const { t, i18n } = useTranslation();
    const keyOptions = useMemo(() => {
      let ret: { label: string; value: SeriesOrder['key'] }[] = [
        { label: t('chart.series_order.name'), value: 'name' },
        { label: t('chart.series_order.value'), value: 'value' },
        { label: t('chart.series_order.raw'), value: '' },
      ];
      if (hiddenKeys && Array.isArray(hiddenKeys) && hiddenKeys.length > 0) {
        const s = new Set(hiddenKeys);
        ret = ret.filter((r) => !s.has(r.value));
      }
      return ret;
    }, [i18n.language, hiddenKeys]);

    const orderOptions = useMemo(() => {
      return [
        { label: t('chart.series_order.asc'), value: 'asc' },
        { label: t('chart.series_order.desc'), value: 'desc' },
      ];
    }, [i18n.language, hiddenKeys]);

    const { key, order } = value;

    const handleKeyChange = (v: string | null) => {
      if (v === null) {
        return;
      }
      onChange({
        key: v as SeriesOrder['key'],
        order,
      });
    };

    const handleOrderChange = (v: string | null) => {
      if (!v) {
        return;
      }
      onChange({
        key,
        order: v as SeriesOrder['order'],
      });
    };
    return (
      <Group gap="xs" grow align="flex-end">
        <Select
          ref={ref}
          label={label}
          data={keyOptions}
          value={key}
          onChange={handleKeyChange}
          // style={{ flexGrow: 1 }}
        />
        {key !== '' && (
          <SegmentedControl
            size="sm"
            data={orderOptions}
            value={order}
            onChange={handleOrderChange}
            // style={{ flexGrow: 0, flexShrink: 0 }}
          />
        )}
      </Group>
    );
  },
);

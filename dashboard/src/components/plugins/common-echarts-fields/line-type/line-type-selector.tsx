import { Select, Sx } from '@mantine/core';
import { forwardRef, Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IEChartsLineType } from './types';

interface Props {
  label?: string;
  value?: IEChartsLineType;
  onChange: (v: IEChartsLineType) => void;
  sx?: Sx;
}

export const LineTypeSelector = forwardRef(({ label, value, onChange, sx = {} }: Props, ref: Ref<HTMLInputElement>) => {
  const { t, i18n } = useTranslation();

  const options = useMemo(() => {
    const ret = [
      { label: t('chart.series.line.type.solid'), value: 'solid' },
      { label: t('chart.series.line.type.dashed'), value: 'dashed' },
      { label: t('chart.series.line.type.dotted'), value: 'dotted' },
    ];
    return ret;
  }, [i18n.language]);

  return (
    <Select
      ref={ref}
      label={label ?? t('chart.series.line.type.label')}
      data={options}
      value={value}
      onChange={onChange}
      sx={sx}
    />
  );
});

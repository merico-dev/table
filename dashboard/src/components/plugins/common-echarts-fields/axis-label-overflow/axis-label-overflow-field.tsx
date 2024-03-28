import { Stack } from '@mantine/core';
import { forwardRef } from 'react';
import { OverflowField } from './overflow-field';
import { IAxisLabelOverflow, IEchartsOverflow } from './types';
import { useTranslation } from 'react-i18next';

interface ILabelOverflowField {
  value: IAxisLabelOverflow;
  onChange: (v: IAxisLabelOverflow) => void;
}

export const LabelOverflowField = forwardRef(({ value, onChange }: ILabelOverflowField, ref: any) => {
  const { t } = useTranslation();
  const changeLabel = (v: IEchartsOverflow) => {
    onChange({
      ...value,
      on_axis: v,
    });
  };
  const changeTooltip = (v: IEchartsOverflow) => {
    onChange({
      ...value,
      in_tooltip: v,
    });
  };
  return (
    <Stack ref={ref} spacing={0}>
      <OverflowField
        sectionTitle={t('chart.axis.overflow.section_title.on_axis')}
        value={value.on_axis}
        onChange={changeLabel}
      />
      <OverflowField
        sectionTitle={t('chart.axis.overflow.section_title.in_tooltip')}
        value={value.in_tooltip}
        onChange={changeTooltip}
      />
    </Stack>
  );
});

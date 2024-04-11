import { Stack } from '@mantine/core';
import { forwardRef } from 'react';
import { IEchartsOverflow, OverflowField } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { IScatterLabelOverflow } from '../../type';
import { useTranslation } from 'react-i18next';

interface IScatterLabelOverflowField {
  value: IScatterLabelOverflow;
  onChange: (v: IScatterLabelOverflow) => void;
}

export const ScatterLabelOverflowField = forwardRef(({ value, onChange }: IScatterLabelOverflowField, ref: any) => {
  const { t } = useTranslation();
  const changeLabel = (v: IEchartsOverflow) => {
    onChange({
      ...value,
      label: v,
    });
  };
  const changeTooltip = (v: IEchartsOverflow) => {
    onChange({
      ...value,
      tooltip: v,
    });
  };
  return (
    <Stack ref={ref} spacing={0}>
      <OverflowField
        sectionTitle={t('chart.axis.overflow.section_title.on_axis')}
        value={value.label}
        onChange={changeLabel}
      />
      <OverflowField
        sectionTitle={t('chart.axis.overflow.section_title.in_tooltip')}
        value={value.tooltip}
        onChange={changeTooltip}
      />
    </Stack>
  );
});

import { Stack } from '@mantine/core';
import { forwardRef } from 'react';
import { IEchartsOverflow, OverflowField } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { IScatterLabelOverflow } from '../../type';

interface IScatterLabelOverflowField {
  value: IScatterLabelOverflow;
  onChange: (v: IScatterLabelOverflow) => void;
}

export const ScatterLabelOverflowField = forwardRef(({ value, onChange }: IScatterLabelOverflowField, ref: any) => {
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
      <OverflowField sectionTitle="Overflow on Chart" value={value.label} onChange={changeLabel} />
      <OverflowField sectionTitle="Overflow in Tooltip" value={value.tooltip} onChange={changeTooltip} />
    </Stack>
  );
});

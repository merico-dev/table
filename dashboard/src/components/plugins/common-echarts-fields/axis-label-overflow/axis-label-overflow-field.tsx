import { Stack } from '@mantine/core';
import { forwardRef } from 'react';
import { OverflowField } from './overflow-field';
import { IAxisLabelOverflow, IEchartsOverflow } from './types';

interface ILabelOverflowField {
  value: IAxisLabelOverflow;
  onChange: (v: IAxisLabelOverflow) => void;
}

export const LabelOverflowField = forwardRef(({ value, onChange }: ILabelOverflowField, ref: any) => {
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
      <OverflowField sectionTitle="Overflow on Axis" value={value.on_axis} onChange={changeLabel} />
      <OverflowField sectionTitle="Overflow in Tooltip" value={value.in_tooltip} onChange={changeTooltip} />
    </Stack>
  );
});

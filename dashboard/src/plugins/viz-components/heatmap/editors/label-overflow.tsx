import { Stack } from '@mantine/core';
import { forwardRef } from 'react';
import { OverflowField } from '~/plugins/viz-components/cartesian/panel/x-axis/x-axis-label-overflow/overflow-field';
import { IOverflow } from '~/plugins/viz-components/cartesian/panel/x-axis/x-axis-label-overflow/types';
import { IAxisLabelOverflow } from '../type';

interface ILabelOverflowField {
  value: IAxisLabelOverflow;
  onChange: (v: IAxisLabelOverflow) => void;
}

export const LabelOverflowField = forwardRef(({ value, onChange }: ILabelOverflowField, ref: any) => {
  const changeLabel = (v: IOverflow) => {
    onChange({
      ...value,
      on_axis: v,
    });
  };
  const changeTooltip = (v: IOverflow) => {
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

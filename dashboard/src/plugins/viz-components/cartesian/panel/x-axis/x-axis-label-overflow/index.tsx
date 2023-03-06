import { Stack } from '@mantine/core';
import { forwardRef } from 'react';
import { IEchartsOverflow, OverflowField } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { IXAxisLabelOverflow } from './types';

interface IXAxisLabelOverflowField {
  value: IXAxisLabelOverflow;
  onChange: (v: IXAxisLabelOverflow) => void;
}

export const XAxisLabelOverflowField = forwardRef(({ value, onChange }: IXAxisLabelOverflowField, ref: any) => {
  const changeXAxis = (v: IEchartsOverflow) => {
    onChange({
      ...value,
      x_axis: v,
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
      <OverflowField sectionTitle="Overflow on XAxis" value={value.x_axis} onChange={changeXAxis} />
      <OverflowField sectionTitle="Overflow in Tooltip" value={value.tooltip} onChange={changeTooltip} />
    </Stack>
  );
});

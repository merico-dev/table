import { Divider, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import _ from 'lodash';
import { forwardRef } from 'react';
import { OverflowField } from './overflow-field';
import { IOverflow, IXAxisLabelOverflow } from './types';

interface IXAxisLabelOverflowField {
  value: IXAxisLabelOverflow;
  onChange: (v: IXAxisLabelOverflow) => void;
}

export const XAxisLabelOverflowField = forwardRef(({ value, onChange }: IXAxisLabelOverflowField, ref: any) => {
  const changeXAxis = (v: IOverflow) => {
    onChange({
      ...value,
      x_axis: v,
    });
  };
  const changeTooltip = (v: IOverflow) => {
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

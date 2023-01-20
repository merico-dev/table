import { Stack } from '@mantine/core';
import { forwardRef } from 'react';
import { OverflowField } from '~/plugins/viz-components/cartesian/panel/x-axis/x-axis-label-overflow/overflow-field';
import { IOverflow } from '~/plugins/viz-components/cartesian/panel/x-axis/x-axis-label-overflow/types';
import { IScatterLabelOverflow } from '../../type';

interface IScatterLabelOverflowField {
  value: IScatterLabelOverflow;
  onChange: (v: IScatterLabelOverflow) => void;
}

export const ScatterLabelOverflowField = forwardRef(({ value, onChange }: IScatterLabelOverflowField, ref: any) => {
  const changeLabel = (v: IOverflow) => {
    onChange({
      ...value,
      label: v,
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
      <OverflowField sectionTitle="Overflow on Chart" value={value.label} onChange={changeLabel} />
      <OverflowField sectionTitle="Overflow in Tooltip" value={value.tooltip} onChange={changeTooltip} />
    </Stack>
  );
});

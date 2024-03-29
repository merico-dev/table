import { Select } from '@mantine/core';
import { forwardRef, Ref } from 'react';
import { IEchartsLabelPosition, LabelPositionOptionType } from './types';

const defaultOptions: LabelPositionOptionType[] = [
  { label: 'Top', value: 'top' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Outside', value: 'outside' },
  { label: 'Inside', value: 'inside' },
  { label: 'InsideLeft', value: 'insideLeft' },
  { label: 'InsideRight', value: 'insideRight' },
  { label: 'InsideTop', value: 'insideTop' },
  { label: 'InsideBottom', value: 'insideBottom' },
  { label: 'InsideTopLeft', value: 'insideTopLeft' },
  { label: 'InsideBottomLeft', value: 'insideBottomLeft' },
  { label: 'InsideTopRight', value: 'insideTopRight' },
  { label: 'InsideBottomRight', value: 'insideBottomRight' },
];

interface ILabelPositionSelector {
  label: string;
  value: IEchartsLabelPosition;
  onChange: (v: IEchartsLabelPosition) => void;
  options?: LabelPositionOptionType[];
}

export const LabelPositionSelector = forwardRef(
  ({ label, value, onChange, options = defaultOptions }: ILabelPositionSelector, ref: Ref<HTMLInputElement>) => {
    return <Select ref={ref} label={label} data={options} value={value} onChange={onChange} />;
  },
);

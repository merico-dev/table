import { Select, Sx } from '@mantine/core';
import { forwardRef, Ref } from 'react';
import { ValueType } from './type';
import _ from 'lodash';

const labels = {
  [ValueType.eloc]: 'ELOC',
};

const valueTypes = Object.values(ValueType).map((v) => ({ label: _.get(labels, v, _.capitalize(v)), value: v }));

interface IValueTypeSelector {
  label: string;
  value: string;
  onChange: (value: string) => void;
  sx?: Sx;
}

export const ValueTypeSelector = forwardRef(
  ({ label, value, onChange, sx }: IValueTypeSelector, ref: Ref<HTMLInputElement>) => {
    return <Select ref={ref} label={label} data={valueTypes} value={value} onChange={onChange} sx={sx} />;
  },
);

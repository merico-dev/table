import { Select } from '@mantine/core';
import _ from 'lodash';
import React from 'react';
import { AggregationType } from '../../../utils/aggregation';

const options = [
  { label: 'None', value: 'none' },
  { label: 'Sum', value: 'sum' },
  { label: 'Mean', value: 'mean' },
  { label: 'Median', value: 'median' },
  { label: 'Max', value: 'max' },
  { label: 'Min', value: 'min' },
  { label: '85%', value: 'quantile_85' },
];

interface IAggregationSelector {
  value: AggregationType;
  onChange: (v: AggregationType) => void;
  label: string;
}

function _AggregationSelector({ label, value, onChange }: IAggregationSelector, ref: any) {
  return <Select ref={ref} label={label} data={options} value={value} onChange={onChange} />;
}

export const AggregationSelector = React.forwardRef(_AggregationSelector);

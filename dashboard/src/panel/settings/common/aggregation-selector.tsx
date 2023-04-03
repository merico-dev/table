import { Group, NumberInput, Select, SpacingValue, Sx, SystemProp } from '@mantine/core';
import React, { useEffect } from 'react';
import { AggregationType } from '../../../utils/aggregation';

const options: { label: string; value: AggregationType['type'] }[] = [
  { label: 'None', value: 'none' },
  { label: 'Sum', value: 'sum' },
  { label: 'Mean', value: 'mean' },
  { label: 'Median', value: 'median' },
  { label: 'Max', value: 'max' },
  { label: 'Min', value: 'min' },
  { label: 'Coefficient of Variation', value: 'CV' },
  { label: 'Standard Variation', value: 'std' },
  { label: 'Quantile(99%, 95%, ...)', value: 'quantile' },
];

interface IAggregationSelector {
  value: AggregationType;
  onChange: (v: AggregationType) => void;
  label: string;
  pt?: SystemProp<SpacingValue>;
}

function _AggregationSelector({ label, value, onChange, pt = 'sm' }: IAggregationSelector, ref: $TSFixMe) {
  // migrate from legacy
  useEffect(() => {
    if (typeof value === 'string') {
      console.log(value);
      onChange({
        type: value,
        config: {},
      });
    }
  }, [value, onChange]);

  const changeType = (type: AggregationType['type']) => {
    if (type === 'quantile') {
      onChange({ type: 'quantile', config: { p: 0.99 } });
    } else {
      onChange({ type, config: {} });
    }
  };

  const changePOfQuantile = (p: number) => {
    onChange({
      type: 'quantile',
      config: {
        p,
      },
    });
  };
  return (
    <Group grow noWrap pt={pt}>
      <Select ref={ref} label={label} data={options} value={value.type} onChange={changeType} />
      {value.type === 'quantile' && (
        <NumberInput
          label="p"
          value={value.config.p}
          onChange={changePOfQuantile}
          precision={2}
          min={0.05}
          step={0.05}
          max={1}
        />
      )}
    </Group>
  );
}

export const AggregationSelector = React.forwardRef(_AggregationSelector);

import { Group, NumberInput, Select, SpacingValue, SystemProp, TextInput } from '@mantine/core';
import { IconMathFunction } from '@tabler/icons-react';
import React, { ChangeEvent, useEffect } from 'react';
import { ModalFunctionEditor } from '~/components/widgets/modal-function-editor';
import { AggregationType, DefaultCustomAggregationFunc } from '~/utils/aggregation';

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
  { label: 'Custom', value: 'custom' },
];

interface IAggregationSelector {
  value: AggregationType;
  onChange: (v: AggregationType) => void;
  label: string;
  pt?: SystemProp<SpacingValue>;
  withFallback: boolean;
}

function _AggregationSelector(
  { label, value, onChange, pt = 'sm', withFallback }: IAggregationSelector,
  ref: $TSFixMe,
) {
  // migrate from legacy
  useEffect(() => {
    if (typeof value === 'string') {
      onChange({
        type: value,
        config: {},
        fallback: '0',
      });
    }
  }, [value, onChange]);

  const changeType = (type: AggregationType['type']) => {
    if (type === 'quantile') {
      onChange({ type: 'quantile', config: { p: 0.99 }, fallback: value.fallback });
    } else if (type === 'custom') {
      onChange({ type: 'custom', config: { func: DefaultCustomAggregationFunc }, fallback: value.fallback });
    } else {
      onChange({ type, config: {}, fallback: value.fallback });
    }
  };

  const changePOfQuantile = (p: number) => {
    onChange({
      type: 'quantile',
      config: {
        p,
      },
      fallback: value.fallback,
    });
  };

  const changeCustomFunc = (func: TFunctionString) => {
    onChange({
      type: 'custom',
      config: {
        func,
      },
      fallback: value.fallback,
    });
  };
  const changeFallback = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      fallback: e.currentTarget.value,
    });
  };
  return (
    <>
      <Group grow noWrap pt={pt}>
        <Select
          ref={ref}
          label={label}
          data={options}
          value={value.type}
          onChange={changeType}
          maxDropdownHeight={600}
        />
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
        {value.type === 'custom' && (
          <ModalFunctionEditor
            label=""
            triggerLabel="Edit Function"
            value={value.config.func}
            onChange={changeCustomFunc}
            defaultValue={DefaultCustomAggregationFunc}
            triggerButtonProps={{
              size: 'xs',
              sx: { flexGrow: 0, alignSelf: 'center', marginTop: '22px' },
              leftIcon: <IconMathFunction size={16} />,
            }}
          />
        )}
      </Group>
      {withFallback && (
        <TextInput
          label="Fallback Value"
          description="Used when data is empty or the aggregation yields NaN"
          value={value.fallback}
          onChange={changeFallback}
        />
      )}
    </>
  );
}

export const AggregationSelector = React.forwardRef(_AggregationSelector);

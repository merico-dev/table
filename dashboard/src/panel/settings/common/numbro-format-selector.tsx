import { Group, NumberInput, Select, Stack, Text, Switch } from '@mantine/core';
import _ from 'lodash';
import React from 'react';

export type TNumbroFormat = {
  mantissa: number;
  output: 'percent' | 'number';
  average?: boolean;
  trimMantissa?: boolean;
};

export const defaultNumbroFormat: TNumbroFormat = {
  mantissa: 0,
  output: 'number',
  trimMantissa: false,
  average: false,
};

interface INumbroFormatSelector {
  value: TNumbroFormat;
  onChange: (v: TNumbroFormat) => void;
}

function _NumbroFormatSelector({ value, onChange }: INumbroFormatSelector, ref: any) {
  const changeOutput = (output: TNumbroFormat['output']) => {
    onChange({ ...value, output });
  };
  const changeMantissa = (mantissa: TNumbroFormat['mantissa']) => {
    const trimMantissa = mantissa === 0 ? false : value.trimMantissa;
    onChange({ ...value, mantissa, trimMantissa });
  };
  const changeTrimMantissa = (event: any) => {
    onChange({ ...value, trimMantissa: event.currentTarget.checked });
  };
  const changeAverage = (event: any) => {
    onChange({ ...value, average: event.currentTarget.checked });
  };
  return (
    <Stack ref={ref}>
      <Group grow>
        <Select
          label="Format"
          data={[
            { label: '1234', value: 'number' },
            { label: '99%', value: 'percent' },
          ]}
          value={value.output}
          onChange={changeOutput}
        />
        <Switch
          label={
            <Text>
              Average
              <br />
              <Text size={12} color="gray">
                like 1.234k, 1.234m
              </Text>
            </Text>
          }
          checked={value.average}
          onChange={changeAverage}
          disabled={value.output !== 'number'}
        />
      </Group>
      <Group grow>
        <NumberInput
          label="Mantissa"
          defaultValue={0}
          min={0}
          step={1}
          max={4}
          value={value.mantissa}
          onChange={changeMantissa}
        />
        <Switch
          label="Trim mantissa"
          checked={value.trimMantissa}
          onChange={changeTrimMantissa}
          disabled={value.mantissa === 0}
        />
      </Group>
    </Stack>
  );
}

export const NumbroFormatSelector = React.forwardRef(_NumbroFormatSelector);

import { Box, Group, NumberInput, Select, Stack, Switch, Text } from '@mantine/core';
import numbro from 'numbro';
import React from 'react';
import { ArrowRight } from 'tabler-icons-react';
import { TNumbroFormat } from '~/utils';
import { ErrorBoundary } from '~/utils/error-boundary';

const SwitchStyles = {
  root: {
    alignSelf: 'flex-end',
  },
  body: {
    alignItems: 'center',
  },
  label: {
    display: 'block',
  },
};

interface INumbroFormatSelector {
  value: TNumbroFormat;
  onChange: (v: TNumbroFormat) => void;
}

function _NumbroFormatSelector({ value, onChange }: INumbroFormatSelector, ref: $TSFixMe) {
  const changeOutput = (output: TNumbroFormat['output']) => {
    onChange({ ...value, output });
  };
  const changeMantissa = (mantissa: TNumbroFormat['mantissa']) => {
    const trimMantissa = mantissa === 0 ? false : value.trimMantissa;
    onChange({ ...value, mantissa, trimMantissa });
  };
  const changeTrimMantissa = (event: $TSFixMe) => {
    onChange({ ...value, trimMantissa: event.currentTarget.checked });
  };
  const changeAverage = (event: $TSFixMe) => {
    onChange({ ...value, average: event.currentTarget.checked });
  };
  const changeAbsolute = (event: $TSFixMe) => {
    onChange({ ...value, absolute: event.currentTarget.checked });
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
          sx={{ flexGrow: 1 }}
        />
        <Switch
          label={
            <Stack spacing={0}>
              <Text>Absolute</Text>
              <Text size={12} color="gray">
                Non-negative
              </Text>
            </Stack>
          }
          checked={value.absolute}
          onChange={changeAbsolute}
          sx={{ flexGrow: 1 }}
          styles={SwitchStyles}
        />
        <Switch
          label={
            <Stack spacing={0}>
              <Text>Average</Text>
              <Text size={12} color="gray">
                like 1.234k, 1.234m
              </Text>
            </Stack>
          }
          checked={value.average}
          onChange={changeAverage}
          disabled={value.output !== 'number'}
          sx={{ flexGrow: 1 }}
          styles={SwitchStyles}
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
          label={
            <Stack spacing={0}>
              <Text>Trim mantissa</Text>
              <Text size={12} color="gray">
                hide trailing zero(s)
              </Text>
            </Stack>
          }
          checked={value.trimMantissa}
          onChange={changeTrimMantissa}
          disabled={value.mantissa === 0}
          styles={SwitchStyles}
        />
        <Box />
      </Group>
      <Stack spacing={0}>
        <Text weight="bold">Preview</Text>
        <ErrorBoundary>
          <Group position="apart">
            <Text size={12} color="gray">
              123456789 <ArrowRight size={9} /> {numbro(123456789).format(value)}
            </Text>
            <Text size={12} color="gray">
              1234 <ArrowRight size={9} /> {numbro(1234).format(value)}
            </Text>
            <Text size={12} color="gray">
              0.1234 <ArrowRight size={9} /> {numbro(0.1234).format(value)}
            </Text>
          </Group>
        </ErrorBoundary>
      </Stack>
    </Stack>
  );
}

export const NumbroFormatSelector = React.forwardRef(_NumbroFormatSelector);

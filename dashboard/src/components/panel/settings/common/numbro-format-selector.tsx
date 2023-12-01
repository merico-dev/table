import { Box, Button, Collapse, Group, NumberInput, Select, Stack, Switch, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import React from 'react';
import { ErrorBoundary, TNumberFormat, formatNumber } from '~/utils';

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

const numbersToPreview = ['123456789', '1234', '1234.56789', '1.234', '0.123456789', '-0.123456789'];

function PreviewNumberFormat({ format }: { format: TNumberFormat }) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Box>
      <Button
        variant="subtle"
        w="100%"
        compact
        onClick={toggle}
        leftIcon={opened ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
      >
        {opened ? 'Close preview' : 'Open preview'}
      </Button>

      <Collapse in={opened}>
        {opened && (
          <Table highlightOnHover sx={{ tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th>In</th>
                <th>Out</th>
              </tr>
            </thead>
            <tbody>
              {numbersToPreview.map((n) => (
                <tr key={n}>
                  <td>{n}</td>
                  <td>
                    <ErrorBoundary>{formatNumber(n, format)}</ErrorBoundary>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Collapse>
    </Box>
  );
}

interface INumbroFormatSelector {
  value: TNumberFormat;
  onChange: (v: TNumberFormat) => void;
}

function _NumbroFormatSelector({ value, onChange }: INumbroFormatSelector, ref: $TSFixMe) {
  const changeOutput = (output: TNumberFormat['output']) => {
    onChange({ ...value, output });
  };
  const changeMantissa = (mantissa: TNumberFormat['mantissa']) => {
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
    const payload = { ...value, absolute: event.currentTarget.checked };
    console.log(payload);
    onChange(payload);
  };
  console.log({ value });
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
      <PreviewNumberFormat format={value} />
    </Stack>
  );
}

export const NumbroFormatSelector = React.forwardRef(_NumbroFormatSelector);

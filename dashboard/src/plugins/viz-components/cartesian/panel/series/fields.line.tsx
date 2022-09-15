import { Box, Group, Select, Switch } from '@mantine/core';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { ICartesianChartConf } from '../../type';

const stepOptions = [
  { label: 'off', value: 'false' },
  { label: 'start', value: 'start' },
  { label: 'middle', value: 'middle' },
  { label: 'end', value: 'end' },
];

interface ILineFields {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
}

export function LineFields({ control, index }: ILineFields) {
  return (
    <Group grow align="center">
      <Controller
        name={`series.${index}.step`}
        control={control}
        render={({ field }) => (
          <Select
            label="Step"
            data={stepOptions}
            sx={{ flexGrow: 1, maxWidth: '48%' }}
            {...field}
            value={String(field.value)}
            onChange={(v: string) => {
              const step = v === 'false' ? false : v;
              field.onChange(step);
            }}
          />
        )}
      />
      <Controller
        name={`series.${index}.smooth`}
        control={control}
        render={({ field }) => (
          <Box sx={{ flexGrow: 1 }}>
            <Switch
              label="Smooth Line"
              checked={field.value}
              onChange={(event) => field.onChange(event.currentTarget.checked)}
            />
          </Box>
        )}
      />
    </Group>
  );
}

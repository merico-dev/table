/**
 * NOTE: this file is almost a duplicate of cartesian/panel/regressions/regression-item.tsx
 * FIXME: extract common input widgets & configs, then improve this file
 */

import { Group, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { IRegressionChartConf } from './type';

const regressionOptions = [
  { label: 'Linear', value: 'linear' },
  { label: 'Exponential', value: 'exponential' },
  { label: 'Logarithmic', value: 'logarithmic' },
  { label: 'Polynomial', value: 'polynomial' },
];

interface IRegressionField {
  control: Control<IRegressionChartConf, $TSFixMe>;
  watch: UseFormWatch<IRegressionChartConf>;
  data: $TSFixMe[];
}

export function RegressionField({ control, watch, data }: IRegressionField) {
  const method = watch('regression.transform.config.method');
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name={`regression.name`}
          control={control}
          render={({ field }) => <TextInput label="Name" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`regression.y_axis_data_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="Value Field" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`regression.transform.config.method`}
          control={control}
          render={({ field }) => <Select label="Method" data={regressionOptions} sx={{ flex: 1 }} {...field} />}
        />
        {method === 'polynomial' && (
          <Controller
            name={`regression.transform.config.order`}
            control={control}
            render={({ field }) => <NumberInput label="Order" sx={{ flex: 1 }} {...field} />}
          />
        )}
      </Group>
      <Stack spacing={4}>
        <Text size="sm">Color</Text>
        <Controller
          name={`regression.plot.color`}
          control={control}
          render={({ field }) => <MantineColorSelector {...field} />}
        />
      </Stack>
    </Stack>
  );
}

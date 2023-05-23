import { Group, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { IRegressionChartConf } from '../type';

const regressionOptions = [
  { label: 'Linear', value: 'linear' },
  { label: 'Exponential', value: 'exponential' },
  { label: 'Logarithmic', value: 'logarithmic' },
  { label: 'Polynomial', value: 'polynomial' },
];

interface IRegressionField {
  control: Control<IRegressionChartConf, $TSFixMe>;
  watch: UseFormWatch<IRegressionChartConf>;
  data: TVizData;
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
      </Group>
      <Controller
        name="regression.group_by_key"
        control={control}
        render={({ field }) => (
          <DataFieldSelector
            label="Split into multiple series by this key..."
            data={data}
            clearable
            sx={{ flex: 1 }}
            {...field}
          />
        )}
      />
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

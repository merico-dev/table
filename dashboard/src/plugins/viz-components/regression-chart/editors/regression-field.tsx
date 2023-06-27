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
}

export function RegressionField({ control, watch }: IRegressionField) {
  watch('regression');
  const method = watch('regression.transform.config.method');
  const group_by_key = watch('regression.group_by_key');
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name={`regression.name`}
          control={control}
          render={({ field }) => <TextInput label="回归线名称" sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Controller
        name="regression.group_by_key"
        control={control}
        render={({ field }) => (
          <DataFieldSelector label="按此字段将数据分为多个系列" clearable sx={{ flex: 1 }} {...field} />
        )}
      />
      <Group grow noWrap>
        <Controller
          name={`regression.transform.config.method`}
          control={control}
          render={({ field }) => <Select label="回归方法" data={regressionOptions} sx={{ flex: 1 }} {...field} />}
        />
        {method === 'polynomial' && (
          <Controller
            name={`regression.transform.config.order`}
            control={control}
            render={({ field }) => <NumberInput label="次" sx={{ flex: 1 }} {...field} />}
          />
        )}
      </Group>
      {!group_by_key && (
        <Stack spacing={4}>
          <Text size="sm">颜色</Text>
          <Controller
            name={`regression.plot.color`}
            control={control}
            render={({ field }) => <MantineColorSelector {...field} />}
          />
        </Stack>
      )}
    </Stack>
  );
}

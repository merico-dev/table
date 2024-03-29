import { Button, Divider, Group, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { MantineColorSelector } from '~/components/panel/settings/common/mantine-color';
import { ICartesianChartConf, IRegressionConf } from '../../type';

const regressionOptions = [
  { label: 'Linear', value: 'linear' },
  { label: 'Exponential', value: 'exponential' },
  { label: 'Logarithmic', value: 'logarithmic' },
  { label: 'Polynomial', value: 'polynomial' },
];

const lineTypeOptions = [
  { label: 'solid', value: 'solid' },
  { label: 'dashed', value: 'dashed' },
  { label: 'dotted', value: 'dotted' },
];

interface IRegressionField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  regressionItem: IRegressionConf;
  index: number;
  remove: UseFieldArrayRemove;
  yAxisOptions: {
    label: string;
    value: string;
  }[];
}

export function RegressionField({ control, regressionItem, index, remove, yAxisOptions }: IRegressionField) {
  const method = regressionItem.transform.config.method;
  return (
    <Stack my={0} p={0} sx={{ position: 'relative' }}>
      <Group grow>
        <Controller
          name={`regressions.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label="Name" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`regressions.${index}.group_by_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector
              label="Split into multiple regression lines by this key..."
              clearable
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`regressions.${index}.y_axis_data_key`}
          control={control}
          render={({ field }) => <DataFieldSelector label="Value Field" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`regressions.${index}.plot.yAxisIndex`}
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <Select
              label="Y Axis"
              data={yAxisOptions}
              disabled={yAxisOptions.length === 0}
              {...rest}
              value={value?.toString() ?? ''}
              onChange={(value: string | null) => {
                if (!value) {
                  onChange(0);
                  return;
                }
                onChange(Number(value));
              }}
              sx={{ flex: 1 }}
            />
          )}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`regressions.${index}.transform.config.method`}
          control={control}
          // @ts-expect-error type of onChange
          render={({ field }) => <Select label="Method" data={regressionOptions} sx={{ flex: 1 }} {...field} />}
        />
        {method === 'polynomial' && (
          <Controller
            name={`regressions.${index}.transform.config.order`}
            control={control}
            // @ts-expect-error type of onChange
            render={({ field }) => <NumberInput label="Order" sx={{ flex: 1 }} {...field} />}
          />
        )}
      </Group>
      <Divider mb={-15} variant="dashed" label="Line Style" labelPosition="center" />
      <Group grow>
        <Controller
          name={`regressions.${index}.plot.lineStyle.type`}
          control={control}
          // @ts-expect-error type of onChange
          render={({ field }) => <Select label="Line Type" data={lineTypeOptions} sx={{ flexGrow: 1 }} {...field} />}
        />
        <Controller
          name={`regressions.${index}.plot.lineStyle.width`}
          control={control}
          // @ts-expect-error type of onChange
          render={({ field }) => <NumberInput label="Line Width" min={1} max={10} sx={{ flexGrow: 1 }} {...field} />}
        />
      </Group>
      <Stack spacing={4}>
        <Text size="sm">Color</Text>
        <Controller
          name={`regressions.${index}.plot.color`}
          control={control}
          render={({ field }) => <MantineColorSelector {...field} />}
        />
      </Stack>
      <Button
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => remove(index)}
        sx={{ top: 15, right: 5 }}
      >
        Delete this Regression Line
      </Button>
    </Stack>
  );
}

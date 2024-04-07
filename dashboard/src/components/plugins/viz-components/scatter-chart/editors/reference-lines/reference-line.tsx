import { Button, Checkbox, Divider, Group, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove, UseFormWatch } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { MantineColorSelector } from '~/components/panel/settings/common/mantine-color';
import { IScatterChartConf } from '../../type';
import { LineTypeSelector } from '~/components/plugins/common-echarts-fields/line-type';

const orientationOptions = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
];

interface IReferenceLineField {
  control: Control<IScatterChartConf, $TSFixMe>;
  index: number;
  watch: UseFormWatch<IScatterChartConf>;
  remove: UseFieldArrayRemove;
  variableOptions: { label: string; value: string }[];
  yAxisOptions: {
    label: string;
    value: string;
  }[];
}

export function ReferenceLineField({
  control,
  index,
  remove,
  watch,
  variableOptions,
  yAxisOptions,
}: IReferenceLineField) {
  const orientation = watch(`reference_lines.${index}.orientation`);
  return (
    <Stack my={0} p={0} sx={{ position: 'relative' }}>
      <Group grow noWrap>
        <Controller
          name={`reference_lines.${index}.name`}
          control={control}
          render={({ field }) => (
            <TextInput label="Name" placeholder="Average Reference Line" required sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={`reference_lines.${index}.variable_key`}
          control={control}
          // @ts-expect-error type of onChange
          render={({ field }) => <Select label="Value" required data={variableOptions} sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Controller
        name={`reference_lines.${index}.template`}
        control={control}
        render={({ field }) => (
          <TextInput label="Content Template" placeholder="Average: ${avg}" sx={{ flex: 1 }} {...field} />
        )}
      />
      <Group grow>
        <Stack>
          <Controller
            name={`reference_lines.${index}.orientation`}
            control={control}
            render={({ field }) => (
              // @ts-expect-error type of onChange
              <Select label="Orientation" data={orientationOptions} required sx={{ flex: 1 }} {...field} />
            )}
          />
          {orientation === 'vertical' && (
            <Text mt={-10} color="dimmed" size={12}>
              Works only when xAxis values are numbers
            </Text>
          )}
        </Stack>
        {orientation === 'horizontal' && (
          <Controller
            name={`reference_lines.${index}.yAxisIndex`}
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
        )}
      </Group>
      <Divider mb={-10} mt={10} variant="dashed" label="Style" labelPosition="center" />
      <Group grow>
        <Controller
          name={`reference_lines.${index}.lineStyle.type`}
          control={control}
          render={({ field }) => <LineTypeSelector label="Line Type" sx={{ flexGrow: 1 }} {...field} />}
        />
        <Controller
          name={`reference_lines.${index}.lineStyle.width`}
          control={control}
          // @ts-expect-error type of onChange
          render={({ field }) => <NumberInput label="Line Width" min={1} max={10} sx={{ flexGrow: 1 }} {...field} />}
        />
      </Group>
      <Stack spacing={4}>
        <Text size="sm">Color</Text>
        <Controller
          name={`reference_lines.${index}.lineStyle.color`}
          control={control}
          render={({ field }) => <MantineColorSelector {...field} />}
        />
      </Stack>
      {/* <Divider mb={-10} mt={10} variant="dashed" label="Behavior" labelPosition="center" />
      <Controller
        name={`reference_lines.${index}.show_in_legend`}
        control={control}
        render={({ field }) => (
          <Checkbox
            label="Show in legend"
            checked={field.value}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
          />
        )}
      /> */}
      <Button
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => remove(index)}
        sx={{ top: 15, right: 5 }}
      >
        Delete this Reference Line
      </Button>
    </Stack>
  );
}

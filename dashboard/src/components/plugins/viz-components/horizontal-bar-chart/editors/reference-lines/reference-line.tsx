import { Button, Checkbox, Divider, Group, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove, UseFormWatch } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { MantineColorSelector } from '~/components/panel/settings/common/mantine-color';
import { IHorizontalBarChartConf } from '../../type';
import { LineTypeSelector } from '~/components/plugins/common-echarts-fields/line-type';
import { OrientationSelector } from '~/components/plugins/common-echarts-fields/orientation';

interface IReferenceLineField {
  control: Control<IHorizontalBarChartConf, $TSFixMe>;
  index: number;
  watch: UseFormWatch<IHorizontalBarChartConf>;
  remove: UseFieldArrayRemove;
  variableOptions: { label: string; value: string }[];
  xAxisOptions: {
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
  xAxisOptions,
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
            render={({ field }) => <OrientationSelector sx={{ flex: 1 }} {...field} />}
          />
          {orientation === 'vertical' && (
            <Text mt={-10} color="dimmed" size={12}>
              Works only when xAxis values are numbers
            </Text>
          )}
        </Stack>
        {orientation === 'horizontal' && (
          <Controller
            name={`reference_lines.${index}.xAxisIndex`}
            control={control}
            render={({ field }) => (
              // @ts-expect-error type of onChange
              <Select
                label="X Axis"
                data={xAxisOptions}
                disabled={xAxisOptions.length === 0}
                sx={{ flex: 1 }}
                {...field}
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
          render={({ field }) => <LineTypeSelector sx={{ flexGrow: 1 }} {...field} />}
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
      <Divider mb={-10} mt={10} variant="dashed" label="Behavior" labelPosition="center" />
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
      />
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

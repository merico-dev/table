import { Button, Checkbox, Divider, Group, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove, UseFormWatch } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { ICartesianChartConf } from '../../type';

const lineTypeOptions = [
  { label: 'solid', value: 'solid' },
  { label: 'dashed', value: 'dashed' },
  { label: 'dotted', value: 'dotted' },
];

const orientationOptions = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
];

interface IReferenceLineField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
  watch: UseFormWatch<ICartesianChartConf>;
  remove: UseFieldArrayRemove;
  variableOptions: { label: string; value: string }[];
}

export function ReferenceLineField({ control, index, remove, watch, variableOptions }: IReferenceLineField) {
  const orientation = watch(`reference_lines.${index}.orientation`);
  return (
    <Stack key={index} my={0} p={0} sx={{ position: 'relative' }}>
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
          render={({ field }) => <Select label="Value" required data={variableOptions} sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Controller
        name={`reference_lines.${index}.template`}
        control={control}
        render={({ field }) => (
          <TextInput label="Content Template" placeholder="Average: ${avg}" required sx={{ flex: 1 }} {...field} />
        )}
      />
      <Controller
        name={`reference_lines.${index}.orientation`}
        control={control}
        render={({ field }) => (
          <Select label="Orientation" data={orientationOptions} required sx={{ flex: 1 }} {...field} />
        )}
      />
      {orientation === 'vertical' && (
        <Text mt={-10} color="dimmed" size={12}>
          Works only when xAxis values are numbers
        </Text>
      )}
      <Divider variant="dashed" label="Style" labelPosition="center" />
      <Group grow>
        <Controller
          name={`reference_lines.${index}.lineStyle.type`}
          control={control}
          render={({ field }) => <Select label="Line Type" data={lineTypeOptions} sx={{ flexGrow: 1 }} {...field} />}
        />
        <Controller
          name={`reference_lines.${index}.lineStyle.width`}
          control={control}
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

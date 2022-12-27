import { Button, Group, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove, UseFormWatch } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { ICartesianChartConf } from '../../type';

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

import { ActionIcon, Group, Select, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { ICartesianChartConf } from '../../type';

interface IReferenceLineField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
  variableOptions: { label: string; value: string }[];
}

export function ReferenceLineField({ control, index, remove, variableOptions }: IReferenceLineField) {
  return (
    <Stack key={index} my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
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
      <ActionIcon
        color="red"
        variant="subtle"
        onClick={() => remove(index)}
        sx={{ position: 'absolute', top: 15, right: 5 }}
      >
        <Trash size={16} />
      </ActionIcon>
    </Stack>
  );
}

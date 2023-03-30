import { ActionIcon, Button, Divider, Group, Select, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { ICartesianChartConf } from '../../type';

const referenceAreaTypeOptions = [{ label: 'Rectangle', value: 'rectangle' }];
const referenceAreaDirectionOptions = [{ label: 'Horizontal', value: 'horizontal' }];

interface IReferenceAreaField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
  variableOptions: { label: string; value: string }[];
}

export function ReferenceAreaField({ control, index, remove, variableOptions }: IReferenceAreaField) {
  return (
    <Stack key={index} my={0} p={0} sx={{ position: 'relative' }}>
      <Group grow noWrap>
        <Controller
          name={`reference_areas.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label="Name" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`reference_areas.${index}.color`}
          control={control}
          render={({ field }) => <TextInput label="Color" required sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`reference_areas.${index}.type`}
          control={control}
          render={({ field }) => (
            <Select label="Type" required data={referenceAreaTypeOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={`reference_areas.${index}.direction`}
          control={control}
          render={({ field }) => (
            <Select label="Direction" required data={referenceAreaDirectionOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Divider variant="dashed" label="Data" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`reference_areas.${index}.y_keys.upper`}
          control={control}
          render={({ field }) => (
            <Select label="Upper Boundary" required data={variableOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={`reference_areas.${index}.y_keys.lower`}
          control={control}
          render={({ field }) => (
            <Select label="Lower Boundary" required data={variableOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Button
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => remove(index)}
        sx={{ top: 15, right: 5 }}
      >
        Delete this Reference Area
      </Button>
    </Stack>
  );
}

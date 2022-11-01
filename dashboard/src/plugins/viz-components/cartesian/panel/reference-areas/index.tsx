import { Button, Group, Stack } from '@mantine/core';
import { useMemo } from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { ICartesianChartConf } from '../../type';
import { ReferenceAreaField } from './reference-area';

interface IReferenceAreasField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
}

export function ReferenceAreasField({ control, watch }: IReferenceAreasField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'reference_areas',
  });

  const watchFieldArray = watch('reference_areas');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const add = () =>
    append({
      name: '',
      type: 'rectangle',
      direction: 'horizontal',
      y_keys: {
        upper: '',
        lower: '',
      },
    });

  const variables = watch('variables');
  const variableOptions = useMemo(() => {
    return variables.map((v) => ({
      label: v.name,
      value: v.name,
    }));
  }, [variables]);
  return (
    <Stack>
      {controlledFields.map((field, index) => (
        <ReferenceAreaField control={control} index={index} remove={remove} variableOptions={variableOptions} />
      ))}
      <Group position="center" mt="xs">
        <Button onClick={add}>Add a Reference Area</Button>
      </Group>
    </Stack>
  );
}

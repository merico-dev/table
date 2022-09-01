import { Button, Group, Stack } from '@mantine/core';
import React from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { IVizStatsConf } from '../type';
import { VariableField } from './variable';
import { getANewVariable } from '../../../../utils/template';

interface IVariablesField {
  control: Control<IVizStatsConf, any>;
  watch: UseFormWatch<IVizStatsConf>;
  data: any[];
}
export function VariablesField({ control, watch, data }: IVariablesField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variables',
  });

  const watchFieldArray = watch('variables');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const add = () => append(getANewVariable());

  return (
    <Stack>
      {controlledFields.map((_variableItem, index) => (
        <VariableField key={_variableItem.name} control={control} index={index} remove={remove} data={data} />
      ))}
      <Group position="center" mt="xs">
        <Button onClick={add}>Add a Variable</Button>
      </Group>
    </Stack>
  );
}

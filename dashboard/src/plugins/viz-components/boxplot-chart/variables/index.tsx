/**
 * NOTE: this file is almost a duplicate of stats/panel/variables.tsx
 * FIXME: remove this when variables' fields are defined in utils/template
 */
import { Button, Group, Stack } from '@mantine/core';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { getANewVariable } from '~/utils/template';
import { IBoxplotChartConf } from '../type';
import { VariableField } from './variable';

interface IVariablesField {
  control: Control<IBoxplotChartConf, $TSFixMe>;
  watch: UseFormWatch<IBoxplotChartConf>;
  data: $TSFixMe[];
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
        <VariableField control={control} index={index} remove={remove} data={data} />
      ))}
      <Group position="center" mt="xs">
        <Button onClick={add}>Add a Variable</Button>
      </Group>
    </Stack>
  );
}

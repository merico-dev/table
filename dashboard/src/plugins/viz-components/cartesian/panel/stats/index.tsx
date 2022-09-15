/**
 * NOTE: this file is almost a duplicate of stats/panel/variables.tsx
 * FIXME: remove this when variables' fields are defined in utils/template
 */
import { Button, Group, Stack } from '@mantine/core';
import { Control, Controller, useFieldArray, UseFormWatch } from 'react-hook-form';
import { getANewVariable, TemplateInput } from '~/utils/template';
import { ICartesianChartConf } from '../../type';
import { VariableField } from './variable';

interface IVariablesField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
  data: $TSFixMe[];
}

export function StatsField({ control, watch, data }: IVariablesField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'stats.variables',
  });

  watch('stats.templates');
  const watchFieldArray = watch('stats.variables');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const add = () => append(getANewVariable());

  return (
    <Stack>
      <Stack spacing={0}>
        <Controller
          name="stats.templates.top"
          control={control}
          render={({ field }) => (
            <TemplateInput label="Template for stats above the chart" py="md" sx={{ flexGrow: 1 }} {...field} />
          )}
        />
        <Controller
          name="stats.templates.bottom"
          control={control}
          render={({ field }) => (
            <TemplateInput label="Template for stats under the chart" py="md" sx={{ flexGrow: 1 }} {...field} />
          )}
        />
      </Stack>
      {controlledFields.map((_variableItem, index) => (
        <VariableField control={control} index={index} remove={remove} data={data} />
      ))}
      <Group position="center" mt="xs">
        <Button onClick={add}>Add a Variable</Button>
      </Group>
    </Stack>
  );
}

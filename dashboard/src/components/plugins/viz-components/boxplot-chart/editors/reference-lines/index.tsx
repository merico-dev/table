import { Button, Group, Stack } from '@mantine/core';
import { useMemo } from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { IBoxplotChartConf } from '../../type';
import { ReferenceLineField } from './reference-line';
import { ITemplateVariable } from '~/utils';

interface IReferenceLinesField {
  control: Control<IBoxplotChartConf, $TSFixMe>;
  watch: UseFormWatch<IBoxplotChartConf>;
  variables: ITemplateVariable[];
}

export function ReferenceLinesField({ control, watch, variables }: IReferenceLinesField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'reference_lines',
  });

  const watchFieldArray = watch('reference_lines');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const add = () =>
    append({
      name: '',
      template: '',
      variable_key: '',
    });

  const variableOptions = useMemo(() => {
    return variables.map((v) => ({
      label: v.name,
      value: v.name,
    }));
  }, [variables]);
  return (
    <Stack>
      {controlledFields.map((field, index) => (
        <ReferenceLineField
          key={field.id}
          control={control}
          index={index}
          remove={remove}
          variableOptions={variableOptions}
        />
      ))}
      <Group position="center" mt="xs">
        <Button onClick={add}>Add a Reference Line</Button>
      </Group>
    </Stack>
  );
}

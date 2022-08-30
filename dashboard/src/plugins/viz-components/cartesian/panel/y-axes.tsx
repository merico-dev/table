import { ActionIcon, Button, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller, useFieldArray, UseFieldArrayRemove, UseFormWatch } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { defaultNumbroFormat, NumbroFormatSelector } from '../../../../panel/settings/common/numbro-format-selector';
import { ICartesianChartConf } from '../type';

interface IYAxisField {
  control: Control<ICartesianChartConf, any>;
  index: number;
  remove: UseFieldArrayRemove;
}

function YAxisField({ control, index, remove }: IYAxisField) {
  return (
    <Stack key={index} my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
      <Group grow noWrap>
        <Controller
          name={`y_axes.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label="Name" required sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Stack>
        <Controller
          name={`y_axes.${index}.label_formatter`}
          control={control}
          render={({ field }) => <NumbroFormatSelector {...field} />}
        />
      </Stack>
      <ActionIcon
        color="red"
        variant="subtle"
        onClick={() => remove(index)}
        sx={{ position: 'absolute', top: 15, right: 5 }}
        disabled={index === 0}
      >
        <Trash size={16} />
      </ActionIcon>
    </Stack>
  );
}

interface IYAxesField {
  control: Control<ICartesianChartConf, any>;
  watch: UseFormWatch<ICartesianChartConf>;
}
export function YAxesField({ control, watch }: IYAxesField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'y_axes',
  });

  const watchFieldArray = watch('y_axes');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const addYAxis = () =>
    append({
      name: '',
      label_formatter: defaultNumbroFormat,
    });

  return (
    <Stack>
      {controlledFields.map((field, index) => (
        <YAxisField control={control} index={index} remove={remove} />
      ))}
      <Group position="center" mt="xs">
        <Button onClick={addYAxis}>Add a Y Axis</Button>
      </Group>
    </Stack>
  );
}

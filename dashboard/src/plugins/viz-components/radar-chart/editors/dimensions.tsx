import { ActionIcon, Box, Button, Divider, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { Control, Controller, useFieldArray, UseFieldArrayRemove, UseFormWatch } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { defaultNumbroFormat, NumbroFormatSelector } from '~/panel/settings/common/numbro-format-selector';
import { IRadarChartConf } from '../type';

interface IDimensionField {
  control: Control<IRadarChartConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
  data: $TSFixMe[];
}

function DimensionField({ control, index, remove, data }: IDimensionField) {
  return (
    <Stack key={index} my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
      <Group grow noWrap>
        <Controller
          name={`dimensions.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label="Name" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`dimensions.${index}.data_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="Data Key" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={`dimensions.${index}.max`}
          control={control}
          render={({ field }) => <NumberInput label="Max" hideControls required sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Stack>
        <Divider mb={-15} variant="dashed" label="Value Formatter" labelPosition="center" />
        <Controller
          name={`dimensions.${index}.formatter`}
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

interface IDimensionsField {
  control: Control<IRadarChartConf, $TSFixMe>;
  watch: UseFormWatch<IRadarChartConf>;
  data: $TSFixMe[];
}

export function DimensionsField({ control, watch, data }: IDimensionsField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dimensions',
  });

  const watchFieldArray = watch('dimensions');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const addDimension = () =>
    append({
      name: randomId(),
      data_key: '',
      max: 100,
      formatter: defaultNumbroFormat,
    });

  return (
    <Stack>
      {controlledFields.map((field, index) => (
        <DimensionField data={data} control={control} index={index} remove={remove} />
      ))}
      <Group position="center" mt="xs">
        <Button onClick={addDimension}>Add a Dimension</Button>
      </Group>
    </Stack>
  );
}

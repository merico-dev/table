import { ActionIcon, Divider, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { NumbroFormatSelector } from '~/panel/settings/common/numbro-format-selector';
import { IRadarChartConf } from '../../type';

interface IDimensionField {
  control: Control<IRadarChartConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
  data: TVizData;
}

export function DimensionField({ control, index, remove, data }: IDimensionField) {
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
          render={({ field }) => <DataFieldSelector label="Data Key" required sx={{ flex: 1 }} {...field} />}
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

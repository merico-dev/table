import { Button, Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { IRadarChartConf } from '../../type';

interface IDimensionField {
  control: Control<IRadarChartConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
}

export function DimensionField({ control, index, remove }: IDimensionField) {
  return (
    <Stack key={index} my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
      <Group grow noWrap align="top">
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
          rules={{
            validate: (v) => {
              if (Number.isNaN(Number(v))) {
                return 'A number is required';
              }
            },
          }}
          render={({ field, fieldState }) => (
            <TextInput label="Max" required sx={{ flex: 1 }} {...field} error={fieldState.error?.message} />
          )}
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
      <Button
        mt={20}
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => remove(index)}
        disabled={index === 0}
      >
        Delete this Metric
      </Button>
    </Stack>
  );
}

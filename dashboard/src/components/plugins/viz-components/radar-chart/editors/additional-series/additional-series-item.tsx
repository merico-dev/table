import { Button, Group, Stack } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { IRadarChartConf } from '../../type';

type Props = {
  control: Control<IRadarChartConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
};

export function AdditionalSeriesItemField({ control, index, remove }: Props) {
  return (
    <Stack key={index} my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
      <Group grow noWrap>
        <Controller
          name={`additional_series.${index}.name_key`}
          control={control}
          render={({ field }) => <DataFieldSelector label="Series Name Key" required sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Stack>
        <Controller
          name={`additional_series.${index}.color_key`}
          control={control}
          render={({ field }) => <DataFieldSelector label="Color Key" required clearable sx={{ flex: 1 }} {...field} />}
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
        Delete
      </Button>
    </Stack>
  );
}

import { Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { AnyObject } from '~/types';
import { IParetoChartConf } from '../type';

interface IBarField {
  control: Control<IParetoChartConf, $TSFixMe>;
  watch: UseFormWatch<IParetoChartConf>;
  data: AnyObject[];
}
export function BarField({ data, control, watch }: IBarField) {
  watch(['bar']);
  return (
    <Stack>
      <Controller
        name="bar.name"
        control={control}
        render={({ field }) => <TextInput label="Bar Name" sx={{ flex: 1 }} {...field} />}
      />
      <Stack spacing={4}>
        <Text size="sm">Color</Text>
        <Controller name="bar.color" control={control} render={({ field }) => <MantineColorSelector {...field} />} />
      </Stack>
    </Stack>
  );
}

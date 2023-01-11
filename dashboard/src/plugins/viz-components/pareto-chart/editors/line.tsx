import { Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { AnyObject } from '~/types';
import { IParetoChartConf } from '../type';

interface ILineField {
  control: Control<IParetoChartConf, $TSFixMe>;
  watch: UseFormWatch<IParetoChartConf>;
  data: AnyObject[];
}
export function LineField({ data, control, watch }: ILineField) {
  watch(['line']);
  return (
    <Stack>
      <Controller
        name="line.name"
        control={control}
        render={({ field }) => <TextInput label="Line Name" sx={{ flex: 1 }} {...field} />}
      />
      <Stack spacing={2}>
        <Text size="sm">Color</Text>
        <Controller name="line.color" control={control} render={({ field }) => <MantineColorSelector {...field} />} />
      </Stack>
    </Stack>
  );
}

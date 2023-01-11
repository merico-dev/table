import { Divider, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { NumbroFormatSelector } from '~/panel/settings/common/numbro-format-selector';
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
      <Stack spacing={2}>
        <Text size="sm">Color</Text>
        <Controller name="bar.color" control={control} render={({ field }) => <MantineColorSelector {...field} />} />
      </Stack>
      <Stack>
        <Divider mb={-15} variant="dashed" label="Label Format" labelPosition="center" />
        <Controller
          name="bar.label_formatter"
          control={control}
          render={({ field }) => <NumbroFormatSelector {...field} />}
        />
      </Stack>
    </Stack>
  );
}

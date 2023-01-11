import { Stack, Text, Textarea } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { AnyObject } from '~/types';
import { IParetoChartConf } from '../type';

interface IMarkLineField {
  control: Control<IParetoChartConf, $TSFixMe>;
  watch: UseFormWatch<IParetoChartConf>;
  data: AnyObject[];
}
export function MarkLineField({ data, control, watch }: IMarkLineField) {
  watch(['markLine']);
  return (
    <Stack>
      <Controller
        name="markLine.label_template"
        control={control}
        render={({ field }) => (
          <Textarea autosize minRows={2} maxRows={4} label="Label Template" sx={{ flex: 1 }} {...field} />
        )}
      />
      <Stack spacing={2}>
        <Text size="sm">Color</Text>
        <Controller
          name="markLine.color"
          control={control}
          render={({ field }) => <MantineColorSelector {...field} />}
        />
      </Stack>
    </Stack>
  );
}

import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { IScatterChartConf } from '../../type';
import { TooltipMetricsField } from './metrics';
import { Divider, Select, Stack } from '@mantine/core';

const TooltipTriggerOptions = [
  {
    label: 'item',
    value: 'item',
  },
  {
    label: 'axis',
    value: 'axis',
  },
  {
    label: 'none',
    value: 'none',
    disabled: true,
  },
];

interface ITooltipField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
  data: TVizData;
}
export function TooltipField({ data, control, watch }: ITooltipField) {
  watch('tooltip.trigger');
  return (
    <Stack>
      <Controller
        name="tooltip.trigger"
        control={control}
        render={({ field }) => <Select label="Trigger" data={TooltipTriggerOptions} sx={{ flexGrow: 1 }} {...field} />}
      />
      <Divider variant="dashed" />
      <TooltipMetricsField control={control} watch={watch} data={data} />
    </Stack>
  );
}

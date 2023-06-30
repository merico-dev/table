import { Divider, Select, Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { IScatterChartConf } from '../../type';
import { TooltipMetricsField } from './metrics';

const TooltipTriggerOptions = [
  {
    label: 'Scatter Point',
    value: 'item',
  },
  {
    label: 'X Axis',
    value: 'axis',
  },
];

interface ITooltipField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
}
export function TooltipField({ control, watch }: ITooltipField) {
  watch('tooltip.trigger');
  return (
    <Stack>
      <Controller
        name="tooltip.trigger"
        control={control}
        render={({ field }) => <Select label="Trigger" data={TooltipTriggerOptions} sx={{ flexGrow: 1 }} {...field} />}
      />
      <Divider variant="dashed" />
      <TooltipMetricsField control={control} watch={watch} />
    </Stack>
  );
}

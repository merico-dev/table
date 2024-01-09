import { Stack } from '@mantine/core';
import { Control, UseFormWatch } from 'react-hook-form';
import { ICartesianChartConf } from '../../type';
import { TooltipMetricsField } from './metrics';

interface ITooltipField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
}
export function TooltipField({ control, watch }: ITooltipField) {
  return (
    <Stack>
      <TooltipMetricsField control={control} watch={watch} />
    </Stack>
  );
}

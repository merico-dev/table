import { Stack } from '@mantine/core';
import { Control, UseFormWatch } from 'react-hook-form';
import { IBoxplotChartConf } from '../../type';
import { TooltipMetricsField } from './metrics';

interface ITooltipField {
  control: Control<IBoxplotChartConf, $TSFixMe>;
  watch: UseFormWatch<IBoxplotChartConf>;
}
export function TooltipField({ control, watch }: ITooltipField) {
  return (
    <Stack>
      <TooltipMetricsField control={control} watch={watch} />
    </Stack>
  );
}

import { Stack } from '@mantine/core';
import { Control, UseFormWatch } from 'react-hook-form';
import { IBoxplotChartConf } from '../../type';
import { TooltipMetricsField } from './metrics';

interface ITooltipField {
  control: Control<IBoxplotChartConf, $TSFixMe>;
  watch: UseFormWatch<IBoxplotChartConf>;
  data: TVizData;
}
export function TooltipField({ data, control, watch }: ITooltipField) {
  return (
    <Stack>
      <TooltipMetricsField control={control} watch={watch} data={data} />
    </Stack>
  );
}

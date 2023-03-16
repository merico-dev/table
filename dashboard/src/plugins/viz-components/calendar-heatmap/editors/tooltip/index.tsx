import { Control, UseFormWatch } from 'react-hook-form';
import { ICalendarHeatmapConf } from '../../type';
import { TooltipMetricsField } from './metrics';

interface ITooltipField {
  control: Control<ICalendarHeatmapConf, $TSFixMe>;
  watch: UseFormWatch<ICalendarHeatmapConf>;
  data: TVizData;
}
export function TooltipField({ data, control, watch }: ITooltipField) {
  return <TooltipMetricsField control={control} watch={watch} data={data} />;
}

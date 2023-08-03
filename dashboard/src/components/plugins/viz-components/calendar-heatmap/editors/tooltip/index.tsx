import { Control, UseFormWatch } from 'react-hook-form';
import { ICalendarHeatmapConf } from '../../type';
import { TooltipMetricsField } from './metrics';

interface ITooltipField {
  control: Control<ICalendarHeatmapConf, $TSFixMe>;
  watch: UseFormWatch<ICalendarHeatmapConf>;
}
export function TooltipField({ control, watch }: ITooltipField) {
  return <TooltipMetricsField control={control} watch={watch} />;
}

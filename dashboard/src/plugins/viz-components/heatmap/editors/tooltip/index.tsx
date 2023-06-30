import { Control, UseFormWatch } from 'react-hook-form';
import { IHeatmapConf } from '../../type';
import { TooltipMetricsField } from './metrics';

interface ITooltipField {
  control: Control<IHeatmapConf, $TSFixMe>;
  watch: UseFormWatch<IHeatmapConf>;
}
export function TooltipField({ control, watch }: ITooltipField) {
  return <TooltipMetricsField control={control} watch={watch} />;
}

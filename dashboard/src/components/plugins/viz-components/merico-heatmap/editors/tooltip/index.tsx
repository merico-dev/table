import { Control, UseFormWatch } from 'react-hook-form';
import { TMericoHeatmapConf } from '../../type';
import { TooltipMetricsField } from './metrics';

interface ITooltipField {
  control: Control<TMericoHeatmapConf, $TSFixMe>;
  watch: UseFormWatch<TMericoHeatmapConf>;
}
export function TooltipField({ control, watch }: ITooltipField) {
  return <TooltipMetricsField control={control} watch={watch} />;
}

import { Control, UseFormWatch } from 'react-hook-form';
import { IHeatmapConf } from '../../type';
import { TooltipMetricsField } from './metrics';

interface ITooltipField {
  control: Control<IHeatmapConf, $TSFixMe>;
  watch: UseFormWatch<IHeatmapConf>;
  data: TVizData;
}
export function TooltipField({ data, control, watch }: ITooltipField) {
  return <TooltipMetricsField control={control} watch={watch} data={data} />;
}

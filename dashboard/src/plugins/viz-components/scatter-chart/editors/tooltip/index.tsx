import { Control, UseFormWatch } from 'react-hook-form';
import { IScatterChartConf } from '../../type';
import { TooltipMetricsField } from './metrics';

interface ITooltipField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
  data: TVizData;
}
export function TooltipField({ data, control, watch }: ITooltipField) {
  return <TooltipMetricsField control={control} watch={watch} data={data} />;
}

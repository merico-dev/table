import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { IPieChartConf } from '../type';
import { getSeries } from './series';
import { getTooltip } from './tooltip';

export function getOption(conf: IPieChartConf, data: TPanelData, width: number) {
  return {
    tooltip: getTooltip(),
    series: getSeries(conf, data, width),
  };
}

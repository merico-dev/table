import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { IPieChartConf } from '../type';
import { getSeries } from './series';

export function getOption(conf: IPieChartConf, data: TPanelData, width: number) {
  return {
    tooltip: defaultEchartsOptions.getTooltip({}),
    series: getSeries(conf, data, width),
  };
}

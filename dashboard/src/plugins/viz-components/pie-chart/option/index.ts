import { IPieChartConf } from '../type';
import { getSeries } from './series';

export function getOption(conf: IPieChartConf, data: TPanelData, width: number) {
  return {
    tooltip: {
      show: true,
      confine: true,
    },
    series: getSeries(conf, data, width),
  };
}

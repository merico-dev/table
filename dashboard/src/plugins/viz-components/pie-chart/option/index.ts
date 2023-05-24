import { IPieChartConf } from '../type';
import { getSeries } from './series';

export function getOption(conf: IPieChartConf, data: TVizData, width: number) {
  return {
    tooltip: {
      show: true,
    },
    series: getSeries(conf, data, width),
  };
}

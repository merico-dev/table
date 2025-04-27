import { IPieChartConf } from '../type';
import { getDataset } from './dataset';
import { getSeries } from './series';
import { getTooltip } from './tooltip';

export function getOption(conf: IPieChartConf, data: TPanelData, width: number) {
  return {
    dataset: getDataset(conf, data),
    tooltip: getTooltip(conf),
    series: getSeries(conf, data, width),
  };
}

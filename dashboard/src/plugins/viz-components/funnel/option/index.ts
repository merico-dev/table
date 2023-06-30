import { AnyObject } from '~/types';
import { IFunnelConf } from '../type';
import { getSeries } from './series';
import { getTooltip } from './tooltip';

export function getOption(conf: IFunnelConf, data: TPanelData) {
  return {
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    tooltip: getTooltip(conf, data),
    series: getSeries(conf, data),
  };
}

import { ICartesianChartConf } from '../type';

export function getGrid(conf: ICartesianChartConf) {
  return {
    bottom: conf.x_axis_name ? 40 : 25,
  };
}

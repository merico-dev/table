import { ICartesianChartConf } from '../type';

export function getGrid(conf: ICartesianChartConf) {
  const hasYAxisName = conf.y_axes.some((y) => !!y.name);
  return {
    bottom: conf.x_axis_name ? 40 : 25,
    top: hasYAxisName ? 30 : 10,
  };
}

import { IScatterChartConf } from '../type';

export function getGrid(conf: IScatterChartConf) {
  const hasYAxisName = conf.y_axes.some((y) => !!y.name);
  return {
    bottom: conf.x_axis.name ? 40 : 25,
    top: hasYAxisName ? 30 : 10,
  };
}

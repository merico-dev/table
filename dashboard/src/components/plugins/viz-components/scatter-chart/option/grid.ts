import { IScatterChartConf } from '../type';

export function getGrid(conf: IScatterChartConf) {
  const hasYAxisName = conf.y_axes.some((y) => !!y.name);
  let top = 15;
  if (hasYAxisName) {
    top += 20;
  }
  if (conf.dataZoom.x_axis_slider) {
    top += 20;
  }

  let bottom = 5;
  if (conf.x_axis.name) {
    bottom += 15;
  }

  return {
    top,
    bottom,
  };
}

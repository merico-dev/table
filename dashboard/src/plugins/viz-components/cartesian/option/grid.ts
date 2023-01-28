import { ICartesianChartConf } from '../type';

export function getGrid(conf: ICartesianChartConf) {
  const hasYAxisName = conf.y_axes.some((y) => !!y.name);
  let top = 10;
  if (hasYAxisName) {
    top += 20;
  }
  if (conf.dataZoom.x_axis_slider) {
    top += 20;
  }

  let bottom = 5;
  if (conf.x_axis_name) {
    bottom += 15;
  }

  return {
    top,
    bottom,
  };
}

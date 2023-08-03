import { ICartesianChartConf } from '../type';

export function getGrid(conf: ICartesianChartConf) {
  const hasYAxisName = conf.y_axes.some((y) => !!y.name);
  let top = 15;
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
  if (conf.series.some((s) => !s.hide_in_legend)) {
    bottom += 20;
  }

  return {
    top,
    right: 15,
    bottom,
    left: 20,
    containLabel: true,
  };
}

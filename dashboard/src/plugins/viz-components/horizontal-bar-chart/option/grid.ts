import { IHorizontalBarChartConf } from '../type';

export function getGrid(conf: IHorizontalBarChartConf) {
  const hasXAxisName = conf.x_axes.some((x) => !!x.name);
  let right = 10;
  if (hasXAxisName) {
    right += 20;
  }

  let left = 5;
  if (conf.y_axis.name) {
    left += 15;
  }
  if (conf.series.some((s) => !s.hide_in_legend)) {
    left += 20;
  }

  return {
    right,
    left,
  };
}

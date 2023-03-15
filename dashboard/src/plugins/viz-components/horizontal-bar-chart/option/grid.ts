import { IHorizontalBarChartConf } from '../type';

export function getGrid(conf: IHorizontalBarChartConf) {
  const hasXAxisNameOnTop = conf.x_axes.some((x) => x.position === 'top' && !!x.name);
  let top = 0;
  if (hasXAxisNameOnTop) {
    top += 15;
  }

  const hasXAxisNameOnBottom = conf.x_axes.some((x) => x.position === 'bottom' && !!x.name);
  let bottom = 10;
  if (hasXAxisNameOnBottom) {
    bottom += 15;
  }
  if (conf.series.some((s) => !s.hide_in_legend)) {
    bottom += 15;
  }

  return {
    top,
    right: 5,
    bottom,
    left: 5,
    containLabel: true,
  };
}

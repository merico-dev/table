import { IBoxplotChartConf } from '../type';

export function getGrid(conf: IBoxplotChartConf) {
  const grid = {
    top: 35,
    left: 20,
    right: 15,
    bottom: 25,
    containLabel: true,
  };

  if (conf.legend.orient === 'vertical') {
    grid.right = 80;
  }
  if (conf.dataZoom.x_axis_slider) {
    grid.top = 50;
  }

  return grid;
}

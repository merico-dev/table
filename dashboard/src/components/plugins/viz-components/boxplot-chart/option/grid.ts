import { IBoxplotChartConf } from '../type';

export function getGrid(conf: IBoxplotChartConf) {
  const grid = {
    top: 30,
    left: 20,
    right: 15,
    bottom: 25,
    containLabel: true,
  };

  if (conf.legend.orient === 'vertical') {
    grid.right = 80;
  }

  return grid;
}

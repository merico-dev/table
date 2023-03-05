import { IHeatmapConf } from '../type';

export function getGrid(conf: IHeatmapConf) {
  const top = 50;

  let bottom = 15;
  if (conf.x_axis.name) {
    bottom += 15;
  }

  return {
    top,
    left: 0,
    right: 0,
    bottom,
  };
}

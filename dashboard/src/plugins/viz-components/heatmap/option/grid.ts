import { IHeatmapConf } from '../type';

export function getGrid(conf: IHeatmapConf) {
  const top = 50;

  let bottom = 0;
  if (conf.x_axis.name) {
    bottom += 20;
  }

  return {
    top,
    left: 0,
    right: 0,
    bottom,
  };
}

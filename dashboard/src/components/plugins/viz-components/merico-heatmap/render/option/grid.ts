import { TMericoHeatmapConf } from '../../type';

export function getGrid(conf: TMericoHeatmapConf) {
  let bottom = 0;
  if (conf.x_axis.name) {
    bottom += 20;
  }

  return {
    top: 45,
    left: 5,
    right: 5,
    bottom,
    containLabel: true,
  };
}

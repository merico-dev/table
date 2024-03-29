import { IHeatmapConf } from '../type';

export function getGrid(conf: IHeatmapConf) {
  let bottom = 0;
  if (conf.x_axis.name) {
    bottom += 20;
  }

  return {
    show: true,
    top: 45,
    left: 5,
    right: 5,
    bottom,
    containLabel: true,
    borderColor: 'none',
    backgroundColor: '#E7E7E9',
    z: 1,
  };
}

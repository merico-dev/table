import { IHeatmapConf } from '../type';

export function getVisualMap(conf: IHeatmapConf) {
  return {
    min: conf.heat_block.min ?? 0,
    max: conf.heat_block.max ?? 100,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    top: 0,
    itemWidth: 15,
  };
}

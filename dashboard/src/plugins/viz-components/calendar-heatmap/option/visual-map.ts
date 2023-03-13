import { ICalendarHeatmapConf } from '../type';

export function getVisualMap(conf: ICalendarHeatmapConf, oneYearMode: boolean) {
  return {
    min: conf.heat_block.min ?? 0,
    max: conf.heat_block.max ?? 100,
    calculable: true,
    orient: 'horizontal',
    left: oneYearMode ? 'center' : 5,
    top: 0,
    itemWidth: 15,
  };
}

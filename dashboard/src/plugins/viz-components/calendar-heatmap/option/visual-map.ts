import { ICalendarHeatmapConf } from '../type';

export function getVisualMap(conf: ICalendarHeatmapConf, years: string[]) {
  return {
    min: conf.heat_block.min ?? 0,
    max: conf.heat_block.max ?? 100,
    calculable: true,
    orient: 'horizontal',
    left: years.length > 1 ? 5 : 'center',
    top: 0,
    itemWidth: 15,
  };
}

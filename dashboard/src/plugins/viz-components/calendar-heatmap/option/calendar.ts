import { AnyObject } from '~/types';
import { ICalendarHeatmapConf } from '../type';

export function getCalendar(conf: ICalendarHeatmapConf, dataByYear: Record<string, AnyObject[]>) {
  const years = Object.keys(dataByYear);
  const showYearLabel = years.length > 1;
  const marginLeft = showYearLabel ? 55 : 5;
  return years.map((y, i) => ({
    top: 60 + 130 * i,
    left: marginLeft,
    right: 5,
    cellSize: ['auto', 13],
    range: y,
    itemStyle: {
      borderColor: '#eee',
    },
    splitLine: {
      show: true,
    },
    dayLabel: {
      firstDay: 1,
    },
    yearLabel: { show: showYearLabel, margin: 30 },
  }));
}

import { ICalendarHeatmapConf } from '../type';

export function getCalendar(conf: ICalendarHeatmapConf, years: string[]) {
  return {
    top: 50,
    left: 25,
    right: 5,
    cellSize: ['auto', 13],
    range: years[0],
    itemStyle: {
      borderColor: '#eee',
    },
    splitLine: {
      show: true,
    },
    dayLabel: {
      firstDay: 1,
    },
    monthLabel: {
      position: 'end',
    },
    yearLabel: { show: true },
  };
}

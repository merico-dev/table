import { AnyObject } from '~/types';
import { ICalendarHeatmapConf } from '../type';

export function getSeries(oneYearMode: boolean, dataByYear: Record<string, AnyObject[]>, plotData: AnyObject[]) {
  if (oneYearMode) {
    return {
      type: 'heatmap',
      name: 'heatmap',
      coordinateSystem: 'calendar',
      calendarIndex: 0,
      data: plotData,
    };
  }

  return Object.entries(dataByYear).map(([year, yearData]) => ({
    type: 'heatmap',
    name: year,
    coordinateSystem: 'calendar',
    calendarIndex: 0,
    data: yearData,
  }));
}

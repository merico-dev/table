import _ from 'lodash';
import { AnyObject } from '~/types';
import { ICalendarHeatmapConf } from '../type';

export function getSeries(
  conf: ICalendarHeatmapConf,
  oneYearMode: boolean,
  dataByYear: Record<string, AnyObject[]>,
  data: AnyObject[],
) {
  const { calendar, heat_block } = conf;
  if (oneYearMode) {
    return {
      type: 'heatmap',
      name: 'heatmap',
      coordinateSystem: 'calendar',
      calendarIndex: 0,
      data: data.map((d) => {
        return [_.get(d, calendar.data_key), _.get(d, heat_block.data_key)];
      }),
    };
  }

  return Object.entries(dataByYear).map(([year, data]) => ({
    type: 'heatmap',
    name: year,
    coordinateSystem: 'calendar',
    calendarIndex: 0,
    data: data.map((d) => {
      return [_.get(d, calendar.data_key), _.get(d, heat_block.data_key)];
    }),
  }));
}

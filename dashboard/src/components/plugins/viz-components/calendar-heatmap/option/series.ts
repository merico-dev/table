import _ from 'lodash';
import { AnyObject } from '~/types';
import { ICalendarHeatmapConf } from '../type';
import { parseDataKey } from '~/utils';

export function getSeries(
  conf: ICalendarHeatmapConf,
  oneYearMode: boolean,
  dataByYear: Record<string, AnyObject[]>,
  data: TPanelData,
) {
  const { calendar, heat_block } = conf;
  const c = parseDataKey(calendar.data_key);
  const h = parseDataKey(heat_block.data_key);
  if (oneYearMode) {
    return {
      type: 'heatmap',
      name: 'heatmap',
      coordinateSystem: 'calendar',
      calendarIndex: 0,
      data: data[c.queryID].map((d) => {
        return [_.get(d, c.columnKey), _.get(d, h.columnKey)];
      }),
    };
  }

  return Object.entries(dataByYear).map(([year, yearData]) => ({
    type: 'heatmap',
    name: year,
    coordinateSystem: 'calendar',
    calendarIndex: 0,
    data: yearData.map((d) => {
      return [_.get(d, c.columnKey), _.get(d, h.columnKey)];
    }),
  }));
}

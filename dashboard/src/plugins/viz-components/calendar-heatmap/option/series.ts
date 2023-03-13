import _ from 'lodash';
import { AnyObject } from '~/types';
import { ICalendarHeatmapConf } from '../type';

export function getSeries(conf: ICalendarHeatmapConf, data: AnyObject[]) {
  const { calendar, heat_block } = conf;
  return {
    type: 'heatmap',
    name: heat_block.name,
    coordinateSystem: 'calendar',
    itemStyle: {
      borderColor: 'white',
      borderWidth: 2,
    },
    data: data.map((d) => {
      return [_.get(d, calendar.data_key), _.get(d, heat_block.data_key)];
    }),
  };
}

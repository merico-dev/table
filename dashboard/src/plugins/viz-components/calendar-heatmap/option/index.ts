import _ from 'lodash';
import { defaultsDeep } from 'lodash';
import { ITemplateVariable } from '~/utils/template';
import { ICalendarHeatmapConf } from '../type';
import { getValueFormatters } from './formatters';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getVisualMap } from './visual-map';

const defaultOption = {
  tooltip: {
    confine: true,
  },
  grid: {
    containLabel: true,
  },
};

export function getOption(conf: ICalendarHeatmapConf, data: $TSFixMe[], variables: ITemplateVariable[]) {
  const valueFormatters = getValueFormatters(conf);
  const years = _.unionBy(data, (d) => d[conf.calendar.data_key].split('-')[0]);
  console.log(years);
  const customOptions = {
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      cellSize: ['auto', 13],
      range: '2016',
      itemStyle: {
        borderWidth: 0.5,
      },
      yearLabel: { show: false },
    },
    series: getSeries(conf, data),
    dataset: [
      {
        source: data,
      },
    ],
    tooltip: getTooltip(conf, data, valueFormatters),
    visualMap: getVisualMap(conf),
  };
  return defaultsDeep({}, customOptions, defaultOption);
}

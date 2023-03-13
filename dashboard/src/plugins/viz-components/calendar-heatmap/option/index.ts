import _ from 'lodash';
import { defaultsDeep } from 'lodash';
import { AnyObject } from '~/types';
import { ITemplateVariable } from '~/utils/template';
import { ICalendarHeatmapConf } from '../type';
import { getCalendar } from './calendar';
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

const getYear = (key: string) => (d: AnyObject) => d[key].split('-')[0];

export function getOption(conf: ICalendarHeatmapConf, data: $TSFixMe[], variables: ITemplateVariable[]) {
  const valueFormatters = getValueFormatters(conf);
  const dataByYear = _.groupBy(data, getYear(conf.calendar.data_key));
  const customOptions = {
    calendar: getCalendar(conf, dataByYear),
    series: getSeries(conf, dataByYear),
    tooltip: getTooltip(conf, data, valueFormatters),
    visualMap: getVisualMap(conf),
  };
  return defaultsDeep({}, customOptions, defaultOption);
}

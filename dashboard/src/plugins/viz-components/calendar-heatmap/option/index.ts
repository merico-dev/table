import dayjs from 'dayjs';
import _ from 'lodash';
import { defaultsDeep } from 'lodash';
import { AnyObject } from '~/types';
import { ITemplateVariable } from '~/utils/template';
import { ICalendarHeatmapConf } from '../type';
import { getCalendar } from './calendar';
import { getValueFormatters } from './formatters';
import { getLegend } from './legend';
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

const getYear = (d: string | number) => dayjs(d).get('year');

function getDateStuff(conf: ICalendarHeatmapConf, data: AnyObject[]) {
  const k = conf.calendar.data_key;
  const dataByYear = _.groupBy(data, (d) => getYear(d[k]));
  const years = Object.keys(dataByYear);
  const dates = data.map((d) => dayjs(d[k]).valueOf());
  const minDate = _.min(dates);
  const maxDate = _.max(dates);
  return {
    minDate: minDate ?? 0,
    maxDate: maxDate ?? 0,
    dateSpan: dayjs(maxDate).diff(minDate, 'day'),
    dataByYear,
    years,
  };
}

export function getOption(conf: ICalendarHeatmapConf, data: AnyObject[], variables: ITemplateVariable[]) {
  const valueFormatters = getValueFormatters(conf);
  const { dateSpan, minDate, dataByYear, years } = getDateStuff(conf, data);
  const oneYearMode = dateSpan <= 366;
  const customOptions = {
    calendar: getCalendar(oneYearMode, minDate, years),
    series: getSeries(conf, oneYearMode, dataByYear, data),
    tooltip: getTooltip(conf, data, valueFormatters),
    visualMap: getVisualMap(conf, oneYearMode),
    legend: getLegend(oneYearMode, years),
  };
  return defaultsDeep({}, customOptions, defaultOption);
}

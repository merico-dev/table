import dayjs from 'dayjs';
import _ from 'lodash';
import { defaultsDeep } from 'lodash';
import { AnyObject } from '~/types';
import { ITemplateVariable, formatAggregatedValue, getAggregatedValue } from '~/utils/template';
import { ICalendarHeatmapConf } from '../type';
import { getCalendar } from './calendar';
import { getValueFormatters } from './formatters';
import { getLegend } from './legend';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getVisualMap } from './visual-map';
import { extractData, parseDataKey } from '~/utils/data';

const defaultOption = {
  grid: {
    containLabel: true,
  },
};

const getYear = (d: string | number) => dayjs(d).get('year');

function getDateStuff(conf: ICalendarHeatmapConf, data: TPanelData) {
  const k = parseDataKey(conf.calendar.data_key);
  const queryData = data[k.queryID];
  const dataByYear = _.groupBy(queryData, (d) => getYear(d[k.columnKey]));
  const years = Object.keys(dataByYear);
  const dates = queryData.map((d) => dayjs(d[k.columnKey]).valueOf());
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

export function getOption(conf: ICalendarHeatmapConf, data: TPanelData, variables: ITemplateVariable[]) {
  const variableValueMap = variables.reduce((prev, variable) => {
    const value = getAggregatedValue(variable, data);
    prev[variable.name] = formatAggregatedValue(variable, value);
    return prev;
  }, {} as Record<string, string | number>);

  const valueFormatters = getValueFormatters(conf);
  const { dateSpan, minDate, dataByYear, years } = getDateStuff(conf, data);
  const oneYearMode = dateSpan <= 366;
  const customOptions = {
    calendar: getCalendar(oneYearMode, minDate, years),
    series: getSeries(conf, oneYearMode, dataByYear, data),
    tooltip: getTooltip(conf, data, valueFormatters),
    visualMap: getVisualMap(conf, oneYearMode, variableValueMap),
    legend: getLegend(oneYearMode, years),
  };
  return defaultsDeep({}, customOptions, defaultOption);
}

import dayjs from 'dayjs';
import _ from 'lodash';
import { getSkipRangeColor, getVisualMap } from '~/components/plugins/common-echarts-fields/visual-map';
import { ITemplateVariable, formatAggregatedValue, getAggregatedValue, parseDataKey } from '~/utils';
import { ICalendarHeatmapConf } from '../type';
import { getCalendar } from './calendar';
import { getValueFormatters } from './formatters';
import { getLegend } from './legend';
import { getSeries } from './series';
import { getTooltip } from './tooltip';

const getYear = (d: string | number) => dayjs(d).get('year');

function getDateStuff(plotData: any[]) {
  const dataByYear = _.groupBy(plotData, (d) => d.value[2]);
  const years = Object.keys(dataByYear);
  const dates = plotData.map((d) => dayjs(d.value[0]).valueOf());
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
  const visualMap = getVisualMap(conf.visualMap, variableValueMap);
  const { min, max } = visualMap;

  const valueFormatters = getValueFormatters(conf);
  const c = parseDataKey(conf.calendar.data_key);
  const h = parseDataKey(conf.heat_block.data_key);
  const plotData = data[c.queryID].map((d) => {
    const vc = _.get(d, c.columnKey);
    const vh = _.get(d, h.columnKey);
    const year = getYear(d[c.columnKey]);
    const ret: any = {
      value: [vc, vh, year],
    };

    const { followVisualMap, color } = getSkipRangeColor(vh, min, max, conf.visualMap);
    if (!followVisualMap) {
      ret.visualMap = false;
      ret.itemStyle = {
        color,
      };
    }
    return ret;
  });

  const { dateSpan, minDate, dataByYear, years } = getDateStuff(plotData);
  const oneYearMode = dateSpan <= 366;

  const options = {
    calendar: getCalendar(oneYearMode, minDate, years),
    series: getSeries(oneYearMode, dataByYear, plotData),
    tooltip: getTooltip(conf, data, valueFormatters),
    visualMap: {
      ...visualMap,
      orient: 'horizontal',
      left: oneYearMode ? 'center' : 5,
      dimension: 1,
    },
    legend: getLegend(oneYearMode, years),
    grid: {
      containLabel: true,
    },
  };

  return options;
}

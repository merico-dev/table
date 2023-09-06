import { defaultsDeep } from 'lodash';
import { ITemplateVariable, formatAggregatedValue, getAggregatedValue } from '~/utils/template';
import { IHeatmapConf } from '../type';
import { getLabelFormatters, getValueFormatters } from './formatters';
import { getGrid } from './grid';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getVisualMap } from './visual-map';
import { getXAxis } from './x-axis';
import { getYAxis } from './y-axis';
import _ from 'lodash';
import { parseDataKey } from '~/utils/data';

const defaultOption = {
  tooltip: {
    confine: true,
  },
};

export function getOption(conf: IHeatmapConf, data: TPanelData, variables: ITemplateVariable[]) {
  if (!conf.x_axis.data_key || !conf.y_axis.data_key || !conf.heat_block.data_key) {
    return {};
  }
  const variableValueMap = variables.reduce((prev, variable) => {
    const value = getAggregatedValue(variable, data);
    prev[variable.name] = formatAggregatedValue(variable, value);
    return prev;
  }, {} as Record<string, string | number>);

  const labelFormatters = getLabelFormatters(conf);
  const valueFormatters = getValueFormatters(conf);

  const x = parseDataKey(conf.x_axis.data_key);
  const y = parseDataKey(conf.y_axis.data_key);
  const h = parseDataKey(conf.heat_block.data_key);
  const xData = _.uniq(data[x.queryID].map((d) => d[x.columnKey]));
  const yData = _.uniq(data[x.queryID].map((d) => d[y.columnKey]));
  const seriesData = data[x.queryID].map((d) => [_.get(d, x.columnKey), _.get(d, y.columnKey), _.get(d, h.columnKey)]);
  const borderWidth = 2;

  const customOptions = {
    xAxis: getXAxis(conf, xData, labelFormatters.x_axis),
    yAxis: getYAxis(conf, yData, labelFormatters.y_axis),
    series: getSeries(conf, seriesData, borderWidth),
    tooltip: getTooltip(conf, data, labelFormatters, valueFormatters),
    grid: getGrid(conf),
    visualMap: getVisualMap(conf, variableValueMap),
  };
  return defaultsDeep({}, customOptions, defaultOption);
}

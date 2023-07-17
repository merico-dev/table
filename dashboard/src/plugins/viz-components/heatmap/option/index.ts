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

  const customOptions = {
    xAxis: getXAxis(conf, data, labelFormatters.x_axis),
    yAxis: getYAxis(conf, data, labelFormatters.y_axis),
    series: getSeries(conf, data),
    tooltip: getTooltip(conf, data, labelFormatters, valueFormatters),
    grid: getGrid(conf),
    visualMap: getVisualMap(conf, variableValueMap),
  };
  return defaultsDeep({}, customOptions, defaultOption);
}

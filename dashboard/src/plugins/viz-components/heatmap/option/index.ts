import { defaultsDeep } from 'lodash';
import { ITemplateVariable } from '~/utils/template';
import { IHeatmapConf } from '../type';
import { getLabelFormatters, getValueFormatters } from './formatters';
import { getGrid } from './grid';
import { getLegend } from './legend';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getXAxis } from './x-axis';
import { getYAxis } from './y-axis';

const defaultOption = {
  tooltip: {
    confine: true,
  },
  grid: {
    containLabel: true,
  },
};

export function getOption(conf: IHeatmapConf, data: $TSFixMe[], variables: ITemplateVariable[]) {
  // const variableValueMap = variables.reduce((prev, variable) => {
  //   const value = getAggregatedValue(variable, data);
  //   prev[variable.name] = formatAggregatedValue(variable, value);
  //   return prev;
  // }, {} as Record<string, string | number>);

  const labelFormatters = getLabelFormatters(conf);
  const valueFormatters = getValueFormatters(conf);

  const customOptions = {
    xAxis: getXAxis(conf, data, labelFormatters.x_axis),
    yAxis: getYAxis(conf, data, labelFormatters.y_axis),
    series: getSeries(conf, data),
    dataset: [
      {
        source: data,
      },
    ],
    tooltip: getTooltip(conf, data, labelFormatters, valueFormatters),
    grid: getGrid(conf),
    legend: getLegend(),
    visualMap: {
      min: 0,
      max: 200,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      top: 0,
    },
  };
  return defaultsDeep({}, customOptions, defaultOption);
}

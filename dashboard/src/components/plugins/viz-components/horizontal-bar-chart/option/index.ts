import _ from 'lodash';
import { ITemplateVariable } from '~/utils';
import { IHorizontalBarChartConf } from '../type';
import { getGrid } from './grid';
import { getLegend } from './legend';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getLabelFormatters } from './utils/label-formatter';
import { getVariableValueMap } from './utils/variables';
import { getXAxes } from './x-axis';
import { getYAxes } from './y-axis';
import { parseDataKey } from '~/utils';

export function getOption(conf: IHorizontalBarChartConf, data: TPanelData, variables: ITemplateVariable[]) {
  if (!conf.y_axis.data_key) {
    return {};
  }

  // preparation
  const variableValueMap = getVariableValueMap(data, variables);
  const labelFormatters = getLabelFormatters(conf);
  const y = parseDataKey(conf.y_axis.data_key);
  const yAxisData = _.uniq(data[y.queryID].map((d) => d[y.columnKey]));
  const valueTypedXAxis = yAxisData.every((d) => !Number.isNaN(Number(d)));

  // options
  const series = getSeries(conf, yAxisData, valueTypedXAxis, data, labelFormatters, variables, variableValueMap);

  const customOptions = {
    xAxis: getXAxes(conf, labelFormatters),
    yAxis: getYAxes(conf, yAxisData),
    series,
    tooltip: getTooltip(conf, series, labelFormatters),
    grid: getGrid(conf),
    legend: getLegend(series),
  };
  return customOptions;
}

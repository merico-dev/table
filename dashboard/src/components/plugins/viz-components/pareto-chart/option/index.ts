import { ITemplateVariable, parseDataKey } from '~/utils';
import { getEchartsDataZoomOption } from '../../cartesian/editors/echarts-zooming-field/get-echarts-data-zoom-option';
import { IParetoChartConf } from '../type';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getFormatters } from './utils';
import { getXAxis } from './x-axis';
import { getYAxes } from './y-axes';
import { getReferenceLines } from './reference_lines';
import { getVariableValueMap } from '../../cartesian/option/utils/variables';
import { BarData } from './types';

const getGrid = () => {
  return {
    top: 50,
    left: 30,
    right: 15,
    bottom: 5,
    containLabel: true,
  };
};

export function getOption(conf: IParetoChartConf, data: TPanelData, variables: ITemplateVariable[]) {
  const variableValueMap = getVariableValueMap(data, variables);
  const formatters = getFormatters(conf);

  const { x_axis, data_key } = conf;
  if (!x_axis.data_key || !data_key) {
    return {
      series: [],
      grid: getGrid(),
    };
  }
  const x = parseDataKey(x_axis.data_key);
  const y = parseDataKey(data_key);
  if (x.queryID !== y.queryID) {
    throw new Error('Please use the same query for X & Y axis');
  }
  const barData = data[x.queryID]
    .map((d) => [d[x.columnKey], Number(d[y.columnKey])])
    .sort((a, b) => b[1] - a[1]) as BarData;
  console.log(barData);

  const xAxisData = barData.map((d) => d[0]);
  const option = {
    dataZoom: getEchartsDataZoomOption(conf.dataZoom),
    tooltip: getTooltip(conf, formatters),
    xAxis: getXAxis(conf, xAxisData),
    yAxis: getYAxes(conf, formatters),
    series: [
      ...getSeries(conf, barData, formatters),
      ...getReferenceLines(conf.reference_lines, variables, variableValueMap, data),
    ],
    grid: getGrid(),
  };
  return option;
}

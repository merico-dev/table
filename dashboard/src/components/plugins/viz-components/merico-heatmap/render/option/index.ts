import { ITemplateVariable, formatAggregatedValue, getAggregatedValue, parseDataKey } from '~/utils';
import { TMericoHeatmapConf } from '../../type';
import { getLabelFormatters, getValueFormatters } from './formatters';
import { getGrid } from './grid';
import { getSeries } from './series';
import { getTooltip } from './tooltip';

import { getXAxis } from './x-axis';
import { getYAxis } from './y-axis';
import { getSkipRangeColor, getVisualMap } from '~/components/plugins/common-echarts-fields/visual-map';
import _ from 'lodash';

export function getOption(conf: TMericoHeatmapConf, data: TPanelData, variables: ITemplateVariable[]) {
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

  const visualMap = getVisualMap(conf.visualMap, variableValueMap);
  const { min, max } = visualMap;

  const x = parseDataKey(conf.x_axis.data_key);
  const y = parseDataKey(conf.y_axis.data_key);
  const h = parseDataKey(conf.heat_block.data_key);
  const xData = _.uniq(data[x.queryID].map((d) => d[x.columnKey]));
  const yData = _.uniq(data[x.queryID].map((d) => d[y.columnKey]));
  const seriesData = data[x.queryID].map((d) => {
    const vx = _.get(d, x.columnKey);
    const vy = _.get(d, y.columnKey);
    const vh = _.get(d, h.columnKey);
    const ret: any = {
      value: [vx, vy, vh],
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

  const options = {
    xAxis: getXAxis(conf, xData, labelFormatters.x_axis),
    yAxis: getYAxis(conf, yData, labelFormatters.y_axis),
    series: getSeries(conf, seriesData),
    tooltip: getTooltip(conf, data, labelFormatters, valueFormatters),
    grid: getGrid(conf),
    visualMap,
  };
  return options;
}

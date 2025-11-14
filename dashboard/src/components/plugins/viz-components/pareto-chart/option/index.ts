import { get, isEmpty } from 'lodash';
import { ITemplateVariable, parseDataKey } from '~/utils';
import { getEchartsDataZoomOption } from '../../cartesian/editors/echarts-zooming-field/get-echarts-data-zoom-option';
import { getVariableValueMap } from '../../cartesian/option/utils/variables';
import { IParetoChartConf } from '../type';
import { getReferenceLines } from './reference_lines';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { BarData } from './types';
import { getFormatters } from './utils';
import { getXAxis } from './x-axis';
import { getYAxes } from './y-axes';

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
  const xAxisIdKey = isEmpty(x_axis.id_key) ? x_axis.data_key : x_axis.id_key;
  const x = parseDataKey(xAxisIdKey);
  const xAxisLabel = parseDataKey(x_axis.data_key);
  const y = parseDataKey(data_key);
  if (x.queryID !== y.queryID) {
    throw new Error('Please use the same query for X & Y axis');
  }
  const barData = buildBarData(data[x.queryID], x.columnKey, xAxisLabel.columnKey, y.columnKey).sort(
    (a, b) => b[1] - a[1],
  ) as BarData;

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

export function buildBarData(data: TQueryData, xAxisIdKey: string, xAxisLabelKey: string, yAxisValueKey: string) {
  const xAxisCategories = new Map<string, number>();

  function tryGetValidCategory(category: string, recordId?: string) {
    const existing = xAxisCategories.get(category);
    if (existing != null) {
      if (!isEmpty(recordId) && category !== recordId) {
        const categoryWithId = `${category} (${recordId})`;
        const existingWithId = xAxisCategories.get(categoryWithId);
        if (existingWithId != null) {
          xAxisCategories.set(categoryWithId, existingWithId + 1);
          return `${category} (${recordId}) (${existingWithId + 1})`;
        } else {
          xAxisCategories.set(categoryWithId, 0);
          return categoryWithId;
        }
      } else {
        xAxisCategories.set(category, existing + 1);
        return `${category} (${existing + 1})`;
      }
    } else {
      xAxisCategories.set(category, 0);
      return category;
    }
  }

  const barData: [x: string, y: number][] = [];

  for (const record of data) {
    let category = get(record, xAxisLabelKey);
    const recordId = get(record, xAxisIdKey);
    category = tryGetValidCategory(category, recordId);
    barData.push([category, Number(get(record, yAxisValueKey))]);
  }
  return barData;
}

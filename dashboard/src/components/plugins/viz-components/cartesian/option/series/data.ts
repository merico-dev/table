import _ from 'lodash';
import { AnyObject } from '~/types';
import { aggregateValue, AggregationType, formatNumbersAndAggregateValue } from '~/utils';
import { DataTemplateType } from './types';
import { extractData, extractFullQueryData, parseDataKey } from '~/utils';

type XYDataItemType = [string | number, string | number];

function makeXYData(data: TPanelData, x_axis_data_key: string, y_axis_data_key: string): XYDataItemType[] {
  const xData = extractData(data, x_axis_data_key);
  const yData = extractData(data, y_axis_data_key);
  return _.zip(xData, yData);
}

function getFullSeriesItemData(
  dataTemplate: DataTemplateType[],
  seriesItemData: TPanelData,
  x_axis_data_key: string,
  y_axis_data_key: string,
) {
  const effectiveData = makeXYData(seriesItemData, x_axis_data_key, y_axis_data_key);
  return _.unionBy(effectiveData, dataTemplate, 0);
}

interface IMakePlainSeriesData {
  dataTemplate: DataTemplateType[];
  data: TPanelData;
  x_axis_data_key: string;
  y_axis_data_key: string;
  valueTypedXAxis: boolean;
}
function makePlainSeriesData({
  dataTemplate,
  data,
  x_axis_data_key,
  y_axis_data_key,
  valueTypedXAxis,
}: IMakePlainSeriesData) {
  if (valueTypedXAxis) {
    return getFullSeriesItemData(dataTemplate, data, x_axis_data_key, y_axis_data_key);
  }
  return extractData(data, y_axis_data_key);
}

interface IMakeOneSeriesData {
  dataTemplate: DataTemplateType[];
  data: TPanelData;
  aggregation_on_value?: AggregationType;
  x_axis_data_key: string;
  y_axis_data_key: string;
  valueTypedXAxis: boolean;
}
export function makeOneSeriesData({
  dataTemplate,
  data,
  aggregation_on_value,
  x_axis_data_key,
  y_axis_data_key,
  valueTypedXAxis,
}: IMakeOneSeriesData) {
  if (!aggregation_on_value || aggregation_on_value.type === 'none') {
    return makePlainSeriesData({ dataTemplate, data, x_axis_data_key, y_axis_data_key, valueTypedXAxis });
  }
  const fullData = makeXYData(data, x_axis_data_key, y_axis_data_key);
  const group_by_x = _.groupBy(fullData, '0');
  const aggregatedData = dataTemplate.map(([x]) => {
    const rows = group_by_x[x];
    const yData = rows.map((r) => r[1]);
    const y = formatNumbersAndAggregateValue(yData, aggregation_on_value);
    return [x, y];
  });

  return aggregatedData;
}

interface IMakeGroupedSeriesData {
  group_by_key: string;
  data: TPanelData;
  x_axis_data_key: string;
  y_axis_data_key: string;
}
export function makeGroupedSeriesData({
  group_by_key,
  data,
  x_axis_data_key,
  y_axis_data_key,
}: IMakeGroupedSeriesData) {
  const { queryID, columnKey } = parseDataKey(group_by_key);
  const groups = _.groupBy(data[queryID], columnKey);

  Object.entries(groups).forEach(([groupName, _data]) => {
    groups[groupName] = makeXYData({ [queryID]: _data }, x_axis_data_key, y_axis_data_key);
    return;
  });

  return groups;
}

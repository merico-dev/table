import _ from 'lodash';
import { AnyObject } from '~/types';
import { aggregateValue, AggregationType } from '~/utils/aggregation';
import { DataTemplateType } from './types';

type XYDataItemType = [string | number, string | number];

function makeXYData(data: AnyObject[], x_axis_data_key: string, y_axis_data_key: string): XYDataItemType[] {
  return data.map((d) => [d[x_axis_data_key], d[y_axis_data_key]]);
}

function getFullSeriesItemData(
  dataTemplate: DataTemplateType[],
  seriesItemData: AnyObject[],
  x_axis_data_key: string,
  y_axis_data_key: string,
) {
  const effectiveData = makeXYData(seriesItemData, x_axis_data_key, y_axis_data_key);
  return _.unionBy(effectiveData, dataTemplate, 0);
}

interface IMakePlainSeriesData {
  dataTemplate: DataTemplateType[];
  data: AnyObject[];
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
  return data.map((d) => d[y_axis_data_key]);
}

interface IMakeOneSeriesData {
  dataTemplate: DataTemplateType[];
  data: AnyObject[];
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
  const aggregatedData = Object.entries(group_by_x).map(([x, rows]) => {
    const y = aggregateValue(rows, '1', aggregation_on_value);
    return [x, y];
  });

  return aggregatedData;
}

interface IMakeGroupedSeriesData {
  group_by_key: string;
  data: AnyObject[];
  x_axis_data_key: string;
  y_axis_data_key: string;
}
export function makeGroupedSeriesData({
  group_by_key,
  data,
  y_axis_data_key,
  x_axis_data_key,
}: IMakeGroupedSeriesData) {
  const groups = _.groupBy(data, group_by_key);

  Object.entries(groups).forEach(([groupName, _data]) => {
    groups[groupName] = makeXYData(_data, x_axis_data_key, y_axis_data_key);
    return;
  });

  return groups;
}

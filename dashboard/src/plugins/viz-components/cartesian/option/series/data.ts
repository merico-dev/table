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
  aggregation_on_group?: AggregationType;
  x_axis_data_key: string;
  y_axis_data_key: string;
  valueTypedXAxis: boolean;
}
export function makeOneSeriesData({
  dataTemplate,
  data,
  aggregation_on_group,
  x_axis_data_key,
  y_axis_data_key,
  valueTypedXAxis,
}: IMakeOneSeriesData) {
  if (!aggregation_on_group) {
    return makePlainSeriesData({ dataTemplate, data, x_axis_data_key, y_axis_data_key, valueTypedXAxis });
  }
  if (valueTypedXAxis) {
    return getFullSeriesItemData(dataTemplate, data, x_axis_data_key, y_axis_data_key);
  }
  return data.map((d) => d[y_axis_data_key]);
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
  x_axis_data_key,
  y_axis_data_key,
}: IMakeGroupedSeriesData) {
  const groups = _.groupBy(data, group_by_key);

  Object.entries(groups).forEach(([groupName, _data]) => {
    groups[groupName] = makeXYData(_data, x_axis_data_key, y_axis_data_key);
    return;
  });

  return groups;
}

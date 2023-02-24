import _ from 'lodash';
import { AnyObject } from '~/types';
import { aggregateValue, AggregationType } from '~/utils/aggregation';
import { DataTemplateType } from './types';

function getFullSeriesItemData(
  dataTemplate: DataTemplateType[],
  seriesItemData: AnyObject[],
  x_axis_data_key: string,
  y_axis_data_key: string,
) {
  const effectiveData = seriesItemData.map((d) => [d[x_axis_data_key], d[y_axis_data_key]]);
  return _.unionBy(effectiveData, dataTemplate, 0);
}

interface IMakePlainSeriesData {
  dataTemplate: DataTemplateType[];
  data: AnyObject[];
  x_axis_data_key: string;
  y_axis_data_key: string;
  valueTypedXAxis: boolean;
}
export function makePlainSeriesData({
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

interface IMakeGroupedSeriesData {
  aggregation_on_group?: AggregationType;
  data: AnyObject[];
  x_axis_data_key: string;
  y_axis_data_key: string;
}
export function makeGroupedSeriesData({
  aggregation_on_group,
  data,
  x_axis_data_key,
  y_axis_data_key,
}: IMakeGroupedSeriesData) {
  if (!aggregation_on_group) {
    return data.map((d) => [d[x_axis_data_key], d[y_axis_data_key]]);
  }

  const grouped_by_x = _.groupBy(data, x_axis_data_key);
  return Object.entries(grouped_by_x).map(([x, records]) => {
    const y = aggregateValue(records, y_axis_data_key, aggregation_on_group);
    return [x, y];
  });
}

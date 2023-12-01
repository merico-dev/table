import _ from 'lodash';
import { AnyObject } from '~/types';
import { aggregateValue, AggregationType, formatNumbersAndAggregateValue } from '~/utils';
import { DataTemplateType } from './types';
import { extractData, parseDataKey } from '~/utils';

type YXDataItemType = [string | number, string | number];

function makeYXData(data: TPanelData, name_data_key: string, value_data_key: string): YXDataItemType[] {
  const nameData = extractData(data, name_data_key);
  const valueData = extractData(data, value_data_key);
  return _.zip(valueData, nameData);
}

function getFullSeriesItemData(
  dataTemplate: DataTemplateType[],
  seriesItemData: TPanelData,
  name_data_key: string,
  value_data_key: string,
) {
  const effectiveData = makeYXData(seriesItemData, name_data_key, value_data_key);
  return _.unionBy(effectiveData, dataTemplate, 0);
}

interface IMakePlainSeriesData {
  dataTemplate: DataTemplateType[];
  data: TPanelData;
  name_data_key: string;
  value_data_key: string;
  valueTypedXAxis: boolean;
}
function makePlainSeriesData({
  dataTemplate,
  data,
  name_data_key,
  value_data_key,
  valueTypedXAxis,
}: IMakePlainSeriesData) {
  if (valueTypedXAxis) {
    return getFullSeriesItemData(dataTemplate, data, name_data_key, value_data_key);
  }
  return makeYXData(data, name_data_key, value_data_key);
}

interface IMakeOneSeriesData {
  dataTemplate: DataTemplateType[];
  data: TPanelData;
  aggregation_on_value?: AggregationType;
  name_data_key: string;
  value_data_key: string;
  valueTypedXAxis: boolean;
}
export function makeOneSeriesData({
  dataTemplate,
  data,
  aggregation_on_value,
  name_data_key,
  value_data_key,
  valueTypedXAxis,
}: IMakeOneSeriesData) {
  if (!aggregation_on_value || aggregation_on_value.type === 'none') {
    return makePlainSeriesData({ dataTemplate, data, name_data_key, value_data_key, valueTypedXAxis });
  }
  const fullData = makeYXData(data, name_data_key, value_data_key);
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
  name_data_key: string;
  value_data_key: string;
}
export function makeGroupedSeriesData({ group_by_key, data, value_data_key, name_data_key }: IMakeGroupedSeriesData) {
  const { queryID, columnKey } = parseDataKey(group_by_key);
  const groups = _.groupBy(data[queryID], columnKey);

  Object.entries(groups).forEach(([groupName, _data]) => {
    groups[groupName] = makeYXData({ [queryID]: _data }, name_data_key, value_data_key);
    return;
  });

  return groups;
}

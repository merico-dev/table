import _, { cloneDeep, groupBy } from 'lodash';
import { aggregateValue } from '~/utils/aggregation';
import { getEchartsSymbolSize } from '../../panel/scatter-size-select/get-echarts-symbol-size';
import { ICartesianChartConf, ICartesianChartSeriesItem } from '../../type';

function getFullSeriesItemData(
  dataTemplate: $TSFixMe[][],
  seriesItemData: $TSFixMe[],
  x_axis_data_key: string,
  y_axis_data_key: string,
) {
  const effectiveData = seriesItemData.map((d) => [d[x_axis_data_key], d[y_axis_data_key]]);
  return _.unionBy(effectiveData, dataTemplate, 0);
}

export function getSeriesItemOrItems(
  { x_axis_data_key }: ICartesianChartConf,
  {
    y_axis_data_key,
    yAxisIndex,
    label_position,
    name,
    group_by_key,
    aggregation_on_group,
    stack,
    color,
    display_name_on_line,
    symbolSize,
    hide_in_legend,
    ...rest
  }: ICartesianChartSeriesItem,
  dataTemplate: $TSFixMe[][],
  valueTypedXAxis: boolean,
  data: $TSFixMe[],
  variableValueMap: Record<string, string | number>,
  labelFormatters: Record<string, $TSFixMe>,
) {
  const seriesItem: $TSFixMe = {
    label: {
      show: !!label_position,
      position: label_position,
      formatter: labelFormatters[yAxisIndex ?? 'default'],
    },
    name,
    xAxisId: 'main-x-axis',
    yAxisIndex,
    stack,
    color,
    symbolSize: getEchartsSymbolSize(symbolSize, data, x_axis_data_key, variableValueMap),
    hide_in_legend,
    ...rest,
  };
  if (display_name_on_line) {
    seriesItem.endLabel = {
      show: true,
      formatter: name,
      offset: [-12, 12],
      align: 'right',
    };
  }
  if (!group_by_key || group_by_key === x_axis_data_key) {
    if (valueTypedXAxis) {
      seriesItem.data = getFullSeriesItemData(dataTemplate, data, x_axis_data_key, y_axis_data_key);
    } else {
      seriesItem.data = data.map((d) => d[y_axis_data_key]);
    }
    return seriesItem;
  }

  const keyedData = groupBy(data, group_by_key);
  return Object.entries(keyedData).map(([groupName, _data]) => {
    const ret = cloneDeep(seriesItem);
    ret.name = groupName;
    ret.color = undefined;

    if (!aggregation_on_group) {
      ret.data = _data.map((d) => [d[x_axis_data_key], d[y_axis_data_key]]);
      return ret;
    }

    const grouped_by_x = groupBy(_data, x_axis_data_key);
    ret.data = Object.entries(grouped_by_x).map(([x, records]) => {
      const y = aggregateValue(records, y_axis_data_key, aggregation_on_group);
      return [x, y];
    });
    return ret;
  });
}

import { cloneDeep } from 'lodash';
import { ICartesianChartConf, ICartesianChartSeriesItem } from '../../type';
import { makeGroupedSeriesData, makeOneSeriesData } from './data';
import { getEChartsSymbolSize } from './get-echarts-symbol-size';
import { DataTemplateType } from './types';
import _ from 'lodash';

export function getSeriesItemOrItems(
  { x_axis_data_key, x_axis }: ICartesianChartConf,
  {
    y_axis_data_key,
    yAxisIndex,
    label_position,
    name,
    group_by_key,
    order_in_group,
    aggregation_on_value,
    stack,
    color,
    display_name_on_line,
    symbolSize,
    hide_in_legend,
    areaStyle,
    ...rest
  }: ICartesianChartSeriesItem,
  dataTemplate: DataTemplateType[],
  data: TPanelData,
  variableValueMap: Record<string, string | number>,
  labelFormatters: Record<string, $TSFixMe>,
) {
  const valueTypedXAxis = x_axis.type !== 'category';
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
    symbolSize: getEChartsSymbolSize(symbolSize, data, x_axis_data_key, variableValueMap),
    hide_in_legend,
    labelLayout: {
      hideOverlap: true,
    },
    ...rest,
  };
  if (rest.type === 'line') {
    seriesItem.lineStyle = {
      width: rest.lineStyle.width,
      type: rest.lineStyle.type,
      shadowColor: 'rgba(255,255,255,1)',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: _.clamp(rest.lineStyle.width, 1, 3),
    };
    if (areaStyle.enabled) {
      seriesItem.lineStyle.shadowColor = 'transparent';

      const { enabled, ...restAreaStyle } = areaStyle;
      seriesItem.areaStyle = {
        ...restAreaStyle,
        color: restAreaStyle.color || color,
      };
    }
  }
  if (display_name_on_line) {
    seriesItem.endLabel = {
      show: true,
      formatter: name,
      offset: [-12, 12],
      align: 'right',
    };
  }
  if (!group_by_key || group_by_key === x_axis_data_key) {
    seriesItem.data = makeOneSeriesData({
      dataTemplate,
      data,
      aggregation_on_value,
      x_axis_data_key,
      y_axis_data_key,
      valueTypedXAxis,
    });
    return seriesItem;
  }
  const groupedData = makeGroupedSeriesData({
    group_by_key,
    data,
    x_axis_data_key,
    y_axis_data_key,
  });

  let groupedDataEntries = Object.entries(groupedData);
  if (order_in_group.key === 'name') {
    groupedDataEntries = _.orderBy(Object.entries(groupedData), 0, [order_in_group.order]);
  }

  return groupedDataEntries.map(([groupName, data]) => {
    const ret = cloneDeep(seriesItem);
    ret.name = groupName;
    ret.color = undefined;
    if ('areaStyle' in ret) {
      ret.areaStyle.color = undefined;
    }
    ret.data = data;
    return ret;
  });
}

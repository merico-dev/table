import { cloneDeep } from 'lodash';
import { AnyObject } from '~/types';
import { IHorizontalBarChartConf, IHorizontalBarChartSeriesItem } from '../../type';
import { makeGroupedSeriesData, makeOneSeriesData } from './data';
import { DataTemplateType } from './types';

export function getSeriesItemOrItems(
  { y_axis }: IHorizontalBarChartConf,
  {
    data_key,
    xAxisIndex,
    label_position,
    name,
    group_by_key,
    aggregation_on_value,
    stack,
    color,
    hide_in_legend,
    invisible,
    id,
    ...rest
  }: IHorizontalBarChartSeriesItem,
  dataTemplate: DataTemplateType[],
  valueTypedXAxis: boolean,
  data: AnyObject[],
  variableValueMap: Record<string, string | number>,
  labelFormatters: Record<string, $TSFixMe>,
) {
  const seriesItem: $TSFixMe = {
    label: {
      show: !!label_position,
      position: label_position,
      formatter: labelFormatters[xAxisIndex ?? 'default'],
    },
    name,
    yAxisId: 'main-y-axis',
    xAxisIndex,
    stack,
    color: invisible ? 'transparent' : color,
    hide_in_legend,
    labelLayout: {
      hideOverlap: true,
    },
    emphasis: {
      disabled: true,
    },
    ...rest,
  };
  if (!group_by_key || group_by_key === y_axis.data_key) {
    seriesItem.data = makeOneSeriesData({
      dataTemplate,
      data,
      aggregation_on_value,
      name_data_key: y_axis.data_key,
      value_data_key: data_key,
      valueTypedXAxis,
    });
    return seriesItem;
  }
  const groupedData = makeGroupedSeriesData({
    group_by_key,
    data,
    name_data_key: y_axis.data_key,
    value_data_key: data_key,
  });
  return Object.entries(groupedData).map(([groupName, data]) => {
    const ret = cloneDeep(seriesItem);
    ret.name = groupName;
    ret.color = undefined;
    ret.data = data;
    return ret;
  });
}

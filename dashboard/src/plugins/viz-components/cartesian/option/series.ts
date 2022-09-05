import { cloneDeep, groupBy } from 'lodash';
import { ICartesianChartConf, ICartesianChartSeriesItem } from '../type';

function getSeriesItemOrItems(
  { x_axis_data_key }: ICartesianChartConf,
  { y_axis_data_key, yAxisIndex, label_position, name, group_by_key, stack, color, ...rest }: ICartesianChartSeriesItem,
  data: any[],
  labelFormatters: Record<string, any>,
) {
  const seriesItem: any = {
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
    ...rest,
  };
  if (!group_by_key) {
    seriesItem.data = data.map((d) => d[y_axis_data_key]);
    return seriesItem;
  }

  const keyedData = groupBy(data, group_by_key);
  return Object.entries(keyedData).map(([groupName, _data]) => {
    const ret = cloneDeep(seriesItem);
    ret.data = _data.map((d) => [d[x_axis_data_key], d[y_axis_data_key]]);
    ret.name = groupName;
    ret.color = undefined;
    return ret;
  });
}

export function getSeries(conf: ICartesianChartConf, data: any[], labelFormatters: Record<string, any>) {
  const ret = conf.series.map((c) => getSeriesItemOrItems(conf, c, data, labelFormatters)).flat();
  return ret;
}

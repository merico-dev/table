import _, { cloneDeep, groupBy } from 'lodash';
import { ICartesianChartConf, ICartesianChartSeriesItem } from '../type';

function getFullSeriesItemData(
  dataTemplate: $TSFixMe[][],
  seriesItemData: $TSFixMe[],
  x_axis_data_key: string,
  y_axis_data_key: string,
) {
  const effectiveData = seriesItemData.map((d) => [d[x_axis_data_key], d[y_axis_data_key]]);
  return _.unionBy(effectiveData, dataTemplate, 0);
}

function getSeriesItemOrItems(
  { x_axis_data_key }: ICartesianChartConf,
  { y_axis_data_key, yAxisIndex, label_position, name, group_by_key, stack, color, ...rest }: ICartesianChartSeriesItem,
  dataTemplate: $TSFixMe[][],
  data: $TSFixMe[],
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
    ...rest,
  };
  if (!group_by_key) {
    seriesItem.data = data.map((d) => d[y_axis_data_key]);
    return seriesItem;
  }

  const keyedData = groupBy(data, group_by_key);
  return Object.entries(keyedData).map(([groupName, _data]) => {
    const ret = cloneDeep(seriesItem);
    ret.data = getFullSeriesItemData(dataTemplate, _data, x_axis_data_key, y_axis_data_key);
    ret.name = groupName;
    ret.color = undefined;
    return ret;
  });
}

export function getSeries(
  conf: ICartesianChartConf,
  xAxisData: $TSFixMe[],
  data: $TSFixMe[],
  labelFormatters: Record<string, $TSFixMe>,
) {
  const dataTemplate = xAxisData.map((v) => [v, 0]);
  const ret = conf.series.map((c) => getSeriesItemOrItems(conf, c, dataTemplate, data, labelFormatters)).flat();
  return ret;
}

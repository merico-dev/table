import { ICartesianChartConf, ICartesianChartSeriesItem } from '../type';

export function getSeries(conf: ICartesianChartConf, data: any[], labelFormatters: Record<string, any>) {
  const ret = conf.series.map(
    ({ y_axis_data_key, yAxisIndex, label_position, name, ...rest }: ICartesianChartSeriesItem) => {
      const seriesItem: any = {
        data: data.map((d) => d[y_axis_data_key]),
        label: {
          show: !!label_position,
          position: label_position,
          formatter: labelFormatters[yAxisIndex ?? 'default'],
        },
        name,
        xAxisId: 'main-x-axis',
        yAxisIndex,
        ...rest,
      };
      return seriesItem;
    },
  );
  return ret;
}

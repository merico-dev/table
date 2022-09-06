import { ICartesianChartConf, IYAxisConf } from '../type';

export function getYAxes(conf: ICartesianChartConf, labelFormatters: Record<string, (p: any) => string>) {
  return conf.y_axes.map(({ ...rest }: IYAxisConf, index: number) => ({
    ...rest,
    axisLabel: {
      show: true,
      formatter: labelFormatters[index] ?? labelFormatters.default,
    },
    nameTextStyle: {
      fontWeight: 'bold',
    },
    nameLocation: 'middle',
    nameGap: 40,
  }));
}

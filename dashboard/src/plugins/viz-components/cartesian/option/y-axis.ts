import { ICartesianChartConf, IYAxisConf } from '../type';

export function getYAxes(conf: ICartesianChartConf, labelFormatters: Record<string, (p: $TSFixMe) => string>) {
  return conf.y_axes.map(({ nameAlignment, ...rest }: IYAxisConf, index: number) => ({
    ...rest,
    axisLabel: {
      show: true,
      formatter: labelFormatters[index] ?? labelFormatters.default,
    },
    nameTextStyle: {
      fontWeight: 'bold',
      align: nameAlignment,
    },
    nameLocation: 'end',
    nameGap: 15,
  }));
}

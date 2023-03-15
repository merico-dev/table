import { IHorizontalBarChartConf } from '../type';

export function getXAxes(conf: IHorizontalBarChartConf, labelFormatters: Record<string, (p: $TSFixMe) => string>) {
  return conf.x_axes.map(({ min, max, ...rest }, index: number) => {
    let position = rest.position;
    if (!position) {
      position = index > 0 ? 'top' : 'bottom';
    }
    return {
      ...rest,
      min: min ? min : undefined,
      max: max ? max : undefined,
      position,
      axisLabel: {
        show: true,
        formatter: labelFormatters[index] ?? labelFormatters.default,
      },
      axisLine: {
        show: true,
      },
      nameTextStyle: {
        fontWeight: 'bold',
      },
      nameLocation: 'end',
      nameGap: 15,
      splitLine: {
        show: false,
      },
    };
  });
}

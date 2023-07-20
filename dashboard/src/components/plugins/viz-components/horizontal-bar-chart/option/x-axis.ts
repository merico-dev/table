import { IHorizontalBarChartConf } from '../type';

export function getXAxes(conf: IHorizontalBarChartConf, labelFormatters: Record<string, (p: $TSFixMe) => string>) {
  return conf.x_axes.map(({ min, max, ...rest }, index: number) => {
    let position = rest.position;
    if (!position) {
      position = index > 0 ? 'bottom' : 'top';
    }
    return {
      ...rest,
      type: 'value',
      min: min ? min : undefined,
      max: max ? max : undefined,
      position,
      axisLabel: {
        show: true,
        margin: 2,
        formatter: labelFormatters[index] ?? labelFormatters.default,
      },
      axisLine: {
        show: true,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
      },
      nameTextStyle: {
        fontWeight: 'bold',
      },
      nameLocation: 'center',
      nameGap: 15,
    };
  });
}

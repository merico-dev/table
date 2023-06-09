import { ICartesianChartConf, IYAxisConf } from '../type';

export function getYAxes(conf: ICartesianChartConf, labelFormatters: Record<string, (p: $TSFixMe) => string>) {
  return conf.y_axes.map(({ nameAlignment, min, max, show, ...rest }: IYAxisConf, index: number) => {
    let position = rest.position;
    if (!position) {
      position = index > 0 ? 'right' : 'left';
    }
    return {
      ...rest,
      show,
      min: min ? min : undefined,
      max: max ? max : undefined,
      position,
      axisLabel: {
        show,
        formatter: labelFormatters[index] ?? labelFormatters.default,
      },
      axisLine: {
        show,
      },
      nameTextStyle: {
        fontWeight: 'bold',
        align: nameAlignment,
      },
      nameLocation: 'end',
      nameGap: show ? 15 : 0,
      splitLine: {
        show: false,
      },
    };
  });
}

import { IYAxisConf } from '../../cartesian/type';
import { IScatterChartConf } from '../type';

export function getYAxes(conf: IScatterChartConf, labelFormatters: Record<string, (p: $TSFixMe) => string>) {
  return conf.y_axes.map(({ nameAlignment, min, max, ...rest }: IYAxisConf, index: number) => {
    let position = rest.position;
    if (!position) {
      position = index > 0 ? 'right' : 'left';
    }
    return {
      ...rest,
      minInterval: 1,
      min: min ? min : undefined,
      max: max ? max : undefined,
      position,
      axisLabel: {
        show: true,
        formatter: labelFormatters[index] ?? labelFormatters.default,
      },
      axisTick: {
        show: true,
        alignWithLabel: true,
        lineStyle: {
          width: 2,
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          width: 3,
        },
      },
      nameTextStyle: {
        align: nameAlignment,
      },
      nameLocation: 'end',
      nameGap: 15,
      splitLine: {
        show: false,
      },
    };
  });
}

import { IYAxisConf } from '../../cartesian/type';
import { IScatterChartConf } from '../type';

export function getYAxes(conf: IScatterChartConf, labelFormatters: Record<string, (p: $TSFixMe) => string>) {
  return conf.y_axes.map(({ nameAlignment, ...rest }: IYAxisConf, index: number) => {
    let position = rest.position;
    if (!position) {
      position = index > 0 ? 'right' : 'left';
    }
    return {
      ...rest,
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

import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { IYAxisConf } from '../../cartesian/type';
import { IScatterChartConf } from '../type';

export function getYAxes(conf: IScatterChartConf, labelFormatters: Record<string, (p: $TSFixMe) => string>) {
  return conf.y_axes.map(({ nameAlignment, min, max, ...rest }: IYAxisConf, index: number) => {
    let position = rest.position;
    if (!position) {
      position = index > 0 ? 'right' : 'left';
    }
    return defaultEchartsOptions.getYAxis({
      ...rest,
      minInterval: 1,
      min: min ? min : undefined,
      max: max ? max : undefined,
      position,
      axisLine: {
        show: true,
      },
      axisLabel: {
        show: true,
        formatter: labelFormatters[index] ?? labelFormatters.default,
      },
      nameTextStyle: {
        align: nameAlignment,
      },
      nameLocation: 'end',
      nameGap: 15,
      splitLine: {
        show: false,
      },
    });
  });
}

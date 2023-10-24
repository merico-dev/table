import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { IHorizontalBarChartConf } from '../type';

export function getXAxes(conf: IHorizontalBarChartConf, labelFormatters: Record<string, (p: $TSFixMe) => string>) {
  return conf.x_axes.map(({ min, max, ...rest }, index: number) => {
    let position = rest.position;
    if (!position) {
      position = index > 0 ? 'bottom' : 'top';
    }
    return defaultEchartsOptions.getYAxis({
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
      nameLocation: 'center',
      nameGap: 15,
    });
  });
}

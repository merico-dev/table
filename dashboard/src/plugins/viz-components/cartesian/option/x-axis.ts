import { getEchartsXAxisLabel } from '../panel/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { ICartesianChartConf } from '../type';

export function getXAxes(conf: ICartesianChartConf, xAxisData: $TSFixMe[], regressionXAxes: $TSFixMe[]) {
  const allNumbers = xAxisData.every((d) => !Number.isNaN(Number(d)));
  const { overflow, ...axisLabel } = conf.x_axis.axisLabel;
  return [
    {
      data: xAxisData,
      name: conf.x_axis_name ?? '',
      id: 'main-x-axis',
      axisTick: {
        show: true,
        alignWithLabel: true,
      },
      type: allNumbers ? 'value' : 'category',
      axisLabel: {
        ...axisLabel,
        width: overflow.x_axis.width,
        overflow: overflow.x_axis.overflow,
        ellipsis: overflow.x_axis.ellipsis,
        formatter: getEchartsXAxisLabel(axisLabel.formatter),
      },
    },
    ...regressionXAxes,
  ];
}

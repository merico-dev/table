import { getEchartsXAxisLabel } from '../panel/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { DEFAULT_X_AXIS_LABEL_FORMATTER } from '../panel/x-axis/x-axis-label-formatter/types';
import { ICartesianChartConf } from '../type';

export function getXAxes(conf: ICartesianChartConf, xAxisData: $TSFixMe[], regressionXAxes: $TSFixMe[]) {
  const allNumbers = xAxisData.every((d) => !Number.isNaN(Number(d)));
  const { axisLabel } = conf.x_axis;
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
        formatter: getEchartsXAxisLabel(axisLabel.formatter),
      },
    },
    ...regressionXAxes,
  ];
}

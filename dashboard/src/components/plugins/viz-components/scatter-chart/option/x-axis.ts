import { getEchartsXAxisLabel } from '../editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IScatterChartConf } from '../type';

export function getXAxes(conf: IScatterChartConf, xAxisData: $TSFixMe[]) {
  const allNumbers = xAxisData.every((d) => !Number.isNaN(Number(d)));
  const { axisLabel } = conf.x_axis;
  return [
    {
      data: xAxisData,
      name: conf.x_axis.name ?? '',
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
  ];
}

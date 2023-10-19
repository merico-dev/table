import { getEchartsXAxisLabel } from '../editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IScatterChartConf } from '../type';

export function getXAxes(conf: IScatterChartConf, xAxisData: $TSFixMe[]) {
  const allNumbers = xAxisData.every((d) => !Number.isNaN(Number(d)));
  const { axisLabel } = conf.x_axis;
  const xDataEmpty = xAxisData.length === 0;
  return [
    {
      data: xAxisData,
      name: conf.x_axis.name ?? '',
      nameGap: xDataEmpty ? 5 : undefined,
      id: 'main-x-axis',
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
      type: allNumbers ? 'value' : 'category',
      axisLabel: {
        ...axisLabel,
        formatter: getEchartsXAxisLabel(axisLabel.formatter),
      },
    },
  ];
}

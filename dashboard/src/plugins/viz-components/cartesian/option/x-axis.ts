import { ICartesianChartConf } from '../type';

export function getXAxes(conf: ICartesianChartConf, xAxisData: $TSFixMe[], regressionXAxes: $TSFixMe[]) {
  const allNumbers = xAxisData.every((d) => !Number.isNaN(Number(d)));
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
      ...conf.x_axis,
    },
    ...regressionXAxes,
  ];
}

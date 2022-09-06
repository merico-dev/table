import { ICartesianChartConf } from '../type';

export function getXAxes(conf: ICartesianChartConf, xAxisData: any[], regressionXAxes: any[]) {
  return [
    {
      data: xAxisData,
      name: conf.x_axis_name ?? '',
      id: 'main-x-axis',
    },
    ...regressionXAxes,
  ];
}

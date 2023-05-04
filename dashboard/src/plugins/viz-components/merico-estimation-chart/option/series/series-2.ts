import * as mathjs from 'mathjs';
import { AnyObject } from '~/types';
import { IMericoEstimationChartConf } from '../../type';

export function getSeries2(
  conf: IMericoEstimationChartConf,
  xAxisData: string[],
  dataGroupedByX: Record<string, TVizData>,
  commonConf: AnyObject,
) {
  const { actual } = conf.y_axis.data_keys;
  const chartData = xAxisData.map((x) => {
    const data = dataGroupedByX[x].map((d) => d[actual]);
    const mad = mathjs.mad(data);
    return [x, mad];
  });
  return {
    type: 'bar',
    name: '平均偏差',
    xAxisIndex: 1,
    yAxisIndex: 1,
    ...commonConf,
    label: {
      position: 'outside',
      show: true,
    },
    data: chartData,
  };
}

import { faker } from '@faker-js/faker';
import { IMericoEstimationChartConf } from '../../type';
import { AnyObject } from '~/types';

export function getSeries2(
  conf: IMericoEstimationChartConf,
  xAxisData: string[],
  dataGroupedByX: Record<string, TVizData>,
  commonConf: AnyObject,
) {
  const chartData = xAxisData.map((x) => [x, faker.datatype.float({ min: -4, max: 4 })]);
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

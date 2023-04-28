import { faker } from '@faker-js/faker';
import { IMericoEstimationChartConf } from '../../type';
import { AnyObject } from '~/types';

export function getSeries1(
  conf: IMericoEstimationChartConf,
  xAxisData: string[],
  dataGroupedByX: Record<string, TVizData>,
  commonConf: AnyObject,
) {
  const chartData = xAxisData.map((x) => [x, faker.datatype.float({ min: 0, max: 1 })]);
  return {
    type: 'bar',
    name: '准确估算比例',
    xAxisIndex: 0,
    yAxisIndex: 0,
    ...commonConf,
    data: chartData,
  };
}

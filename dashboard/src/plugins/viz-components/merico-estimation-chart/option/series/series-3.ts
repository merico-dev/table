import { faker } from '@faker-js/faker';
import { AnyObject } from '~/types';
import { IMericoEstimationChartConf } from '../../type';

export function getSeries3(
  conf: IMericoEstimationChartConf,
  xAxisData: string[],
  dataGroupedByX: Record<string, TVizData>,
  commonConf: AnyObject,
) {
  const chartData = xAxisData.map((x) => {
    const y = faker.datatype.float({ min: 0, max: 1 });
    return [x, y];
  });
  return {
    type: 'bar',
    name: '数量占比',
    xAxisIndex: 2,
    yAxisIndex: 2,
    ...commonConf,
    data: chartData,
  };
}

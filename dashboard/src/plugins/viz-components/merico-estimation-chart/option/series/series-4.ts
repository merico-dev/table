import { IMericoEstimationChartConf } from '../../type';
import { AnyObject } from '~/types';
import _ from 'lodash';

export function getSeries4(
  conf: IMericoEstimationChartConf,
  xAxisData: string[],
  dataGroupedByX: Record<string, TVizData>,
  commonConf: AnyObject,
) {
  const chartData = xAxisData.map((x) => {
    const y = _.sumBy(dataGroupedByX[x], conf.y_axis.data_keys.actual);
    return [x, y];
  });
  return {
    type: 'line',
    name: '代码当量',
    xAxisIndex: 3,
    yAxisIndex: 3,
    ...commonConf,
    data: chartData,
  };
}

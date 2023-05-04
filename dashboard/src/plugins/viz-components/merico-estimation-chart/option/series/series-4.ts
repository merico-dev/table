import _ from 'lodash';
import { IMericoEstimationChartConf } from '../../type';

export function getSeries4(
  conf: IMericoEstimationChartConf,
  xAxisData: string[],
  dataGroupedByX: Record<string, TVizData>,
) {
  const chartData = xAxisData.map((x) => {
    const y = _.sumBy(dataGroupedByX[x], conf.y_axis.data_keys.actual_value);
    return [x, y];
  });
  return {
    type: 'line',
    name: '代码当量',
    xAxisIndex: 3,
    yAxisIndex: 3,
    color: '#b41529',
    data: chartData,
    show_in_legend: false,
  };
}

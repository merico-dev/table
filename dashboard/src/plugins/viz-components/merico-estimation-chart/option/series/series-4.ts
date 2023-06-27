import _ from 'lodash';
import { IMericoEstimationChartConf } from '../../type';
import { IEchartsTooltipMetric } from '~/plugins/common-echarts-fields/tooltip-metric';
import { parseDataKey } from '~/utils/data';

export function getSeries4(
  conf: IMericoEstimationChartConf,
  metric: IEchartsTooltipMetric,
  xAxisData: string[],
  dataGroupedByX: Record<string, TQueryData>,
) {
  const k = parseDataKey(metric.data_key);
  const name = metric.name;

  const chartData = xAxisData.map((x) => {
    const y = _.sumBy(dataGroupedByX[x], k.columnKey);
    return [x, y];
  });
  return {
    type: 'line',
    name,
    xAxisIndex: 3,
    yAxisIndex: 3,
    color: '#b41529',
    data: chartData,
    show_in_legend: false,
  };
}

import { IEchartsTooltipMetric } from '~/components/plugins/common-echarts-fields/tooltip-metric';
import { IMericoEstimationChartConf } from '../../type';
import { getSeries1 } from './series-1';
import { getSeries2 } from './series-2';
import { getSeries3 } from './series-3';
import { getSeries4 } from './series-4';

export function getSeries(
  conf: IMericoEstimationChartConf,
  metric: IEchartsTooltipMetric,
  xAxisData: string[],
  dataGroupedByX: Record<string, TQueryData>,
) {
  const barMinWidth = 5;
  const barMaxWidth = 20;
  const commonConf = { barMinWidth, barMaxWidth };

  return [
    getSeries1(conf, xAxisData, dataGroupedByX),
    getSeries2(conf, xAxisData, dataGroupedByX, commonConf),
    ...getSeries3(conf, xAxisData, dataGroupedByX, commonConf),
    getSeries4(conf, metric, xAxisData, dataGroupedByX),
  ];
}

import { defaultsDeep } from 'lodash';
import { IRegressionChartConf } from '../../type';
import { getRegressionConf } from './regression-series';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getXAxis } from './x-axis';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { UseDataKeyReturn } from '../use-data-key';
import { parseDataKey } from '~/utils';

const defaultOption = {
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    top: 50,
    left: 5,
    right: 10,
    bottom: 20,
    containLabel: true,
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0],
    },
    {
      type: 'inside',
      yAxisIndex: [0],
    },
  ],
};

export function getOption(
  conf: IRegressionChartConf,
  rawData: TPanelData,
  xDataKey: TDataKey,
  yDataKey: TDataKey,
  groupKey: TDataKey,
) {
  if (!xDataKey || !yDataKey) {
    return [];
  }
  const x = parseDataKey(xDataKey);
  const y = parseDataKey(yDataKey);
  const g = parseDataKey(groupKey);
  const series = getSeries(conf, rawData, x, y, g);
  const regressionSeries = getRegressionConf(conf, series);

  const customOptions = {
    xAxis: getXAxis(conf, x),
    yAxis: defaultEchartsOptions.getYAxis({
      name: y.columnKey,
      nameLocation: 'end',
      nameTextStyle: {
        align: 'left',
      },
      nameGap: 5,
    }),
    series: [...series, ...regressionSeries],
    tooltip: getTooltip(conf),
    legend: {
      show: !!g.columnKey && !!g.queryID,
      type: 'scroll',
      orient: 'horizontal',
      align: 'left',
      right: 0,
      top: 0,
      left: 'auto',
      itemGap: 20,
      padding: [4, 8, 0, 140],
      data: series.map((s) => s.name),
    },
  };
  return defaultsDeep({}, customOptions, defaultOption);
}

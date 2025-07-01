import { defaultsDeep } from 'lodash';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { ParsedDataKey, parsedDataKeyValid } from '~/utils';
import { IRegressionChartConf } from '../../type';
import { getRegressionConf } from './regression-series';
import { getSeries } from './series';
import { getTooltip } from './tooltip';

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
  x: ParsedDataKey,
  y: ParsedDataKey,
  g: ParsedDataKey,
) {
  if (!parsedDataKeyValid(x) || !parsedDataKeyValid(y)) {
    return [];
  }

  const series = getSeries(conf, rawData, x, y, g);
  const regressionSeries = getRegressionConf(conf, series);

  const customOptions = {
    xAxis: defaultEchartsOptions.getXAxis({
      type: 'value',
      name: x.columnKey,
      nameLocation: 'middle',
      nameGap: 25,
    }),
    yAxis: defaultEchartsOptions.getYAxis({
      name: y.columnKey,
      nameLocation: 'end',
      nameTextStyle: {
        align: 'left',
      },
      nameGap: 5,
    }),
    series: [...series, ...regressionSeries],
    tooltip: getTooltip(x, y),
    legend: {
      show: !!g.columnKey && !!g.queryID,
      type: 'scroll',
      orient: 'horizontal',
      align: 'left',
      right: 0,
      top: 0,
      left: 'auto',
      itemGap: 20,
      padding: [8, 8, 0, 140],
      data: series.map((s) => s.name),
    },
  };
  return defaultsDeep({}, customOptions, defaultOption);
}

import _, { defaultsDeep } from 'lodash';
import { IRegressionChartConf } from '../type';
import { getRegressionConf } from './regression-series';
import { getTooltip } from './tooltip';
import { getSeries } from './series';

const defaultOption = {
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    top: 20,
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

export function getOption(conf: IRegressionChartConf, data: TVizData) {
  const series = getSeries(conf, data);
  const regressionSeries = getRegressionConf(conf, series);

  const customOptions = {
    xAxis: {
      type: 'value',
      name: conf.x_axis.name ?? '',
      nameLocation: 'middle',
      nameGap: 25,
      axisTick: {
        show: true,
        alignWithLabel: true,
      },
    },
    yAxis: {
      name: conf.y_axis.name ?? '',
      nameLocation: 'end',
      nameTextStyle: {
        align: 'left',
      },
      nameGap: 5,
      axisLine: {
        show: true,
      },
    },
    series: [...series, ...regressionSeries],
    tooltip: getTooltip(conf),
  };
  return defaultsDeep({}, customOptions, defaultOption);
}

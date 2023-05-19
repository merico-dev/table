import _, { defaultsDeep } from 'lodash';
import { IRegressionChartConf } from '../type';
import { getRegressionConf } from './regression-series';

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
  const processedData = _.uniqBy(
    data.map((d) => [d[conf.x_axis.data_key], d[conf.regression.y_axis_data_key]]),
    0,
  );
  const { regressionSeries } = getRegressionConf(conf, processedData);

  const customOptions = {
    xAxis: {
      type: 'category',
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
    series: [
      {
        data: processedData,
        name: conf.y_axis.name,
        type: 'scatter',
        symbolSize: 4,
        color: 'red',
      },
      ...regressionSeries,
    ],
  };
  return defaultsDeep({}, customOptions, defaultOption);
}

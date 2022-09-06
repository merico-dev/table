import _, { defaultsDeep } from 'lodash';
import { IRegressionChartConf } from '../type';
import { getRegressionConf } from './regression-series';

const defaultOption = {
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    top: 10,
    left: 30,
    right: 15,
    bottom: 30,
    containLabel: true,
  },
};

export function getOption(conf: IRegressionChartConf, data: any[]) {
  const { regressionDataSets, regressionSeries, regressionXAxes } = getRegressionConf(conf, data);

  const customOptions = {
    xAxis: [
      {
        data: data.map((d) => d[conf.x_axis.data_key]),
        name: conf.x_axis.name ?? '',
        id: 'main-x-axis',
      },
      ...regressionXAxes,
    ],
    yAxis: {
      name: conf.y_axis.name ?? '',
    },
    dataset: [...regressionDataSets],
    series: [
      {
        data: data.map((d) => d[conf.regression.y_axis_data_key]),
        name: conf.y_axis.name,
        type: 'scatter',
        symbolSize: 4,
        color: 'red',
        xAxisId: 'main-x-axis',
      },
      ...regressionSeries,
    ],
  };
  return defaultsDeep({}, customOptions, defaultOption);
}

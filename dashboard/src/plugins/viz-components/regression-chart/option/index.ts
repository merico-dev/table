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
  const processedData = _.uniqBy(
    data.map((d) => [d[conf.x_axis.data_key], d[conf.regression.y_axis_data_key]]),
    0,
  );
  const { regressionSeries } = getRegressionConf(conf, processedData);

  const customOptions = {
    xAxis: {
      type: 'category',
      name: conf.x_axis.name ?? '',
    },
    yAxis: {
      name: conf.y_axis.name ?? '',
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

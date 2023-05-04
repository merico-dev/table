import { defaultsDeep } from 'lodash';
import { IMericoEstimationChartConf } from '../type';
import { getGrids } from './grid';
import { getSeries } from './series';
import { getXAxes } from './x-axis';
import { getYAxes } from './y-axis';
import _ from 'lodash';
import { getDataWithLevelInfo } from './data';
import { getLegend } from './legend';

const defaultOption = {
  tooltip: {
    trigger: 'axis',
  },
};

function getMetric(conf: IMericoEstimationChartConf, metricKey: string) {
  const { deviation, metrics } = conf;
  const match = metrics.find((m) => m.data_key === metricKey);
  if (match) {
    return match;
  }
  const key = deviation.data_keys.actual_value;
  return {
    id: key,
    name: deviation.name,
    data_key: key,
  };
}

export function getOption(conf: IMericoEstimationChartConf, metricKey: string, rawData: TVizData) {
  const data = getDataWithLevelInfo(conf, rawData);
  const xAxisData = _.uniqBy(rawData, conf.x_axis.data_key).map((d) => d[conf.x_axis.data_key]);
  const dataGroupedByX = _.groupBy(data, conf.x_axis.data_key);
  const metric = getMetric(conf, metricKey);
  const series = getSeries(conf, metric, xAxisData, dataGroupedByX);
  const customOptions = {
    xAxis: getXAxes(conf, xAxisData),
    yAxis: getYAxes(metric),
    series,
    grid: getGrids(conf, data),
    visualMap: [
      {
        min: 0,
        max: 1,
        calculable: true,
        show: false,
        seriesIndex: 0,
        color: ['#EFEFEF', '#418AAF'],
      },
    ],
    legend: getLegend(series),
  };
  return defaultsDeep({}, customOptions, defaultOption);
}

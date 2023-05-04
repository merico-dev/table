import { defaultsDeep } from 'lodash';
import { IMericoEstimationChartConf } from '../type';
import { getGrids } from './grid';
import { getSeries } from './series';
import { getXAxes } from './x-axis';
import { getYAxes } from './y-axis';
import _ from 'lodash';

const defaultOption = {
  tooltip: {
    trigger: 'axis',
  },
};

export function getOption(conf: IMericoEstimationChartConf, data: TVizData) {
  const xAxisData = _.uniqBy(data, conf.x_axis.data_key).map((d) => d[conf.x_axis.data_key]);
  const dataGroupedByX = _.groupBy(data, conf.x_axis.data_key);
  const customOptions = {
    xAxis: getXAxes(conf, xAxisData),
    yAxis: getYAxes(conf, data),
    series: getSeries(conf, data, xAxisData, dataGroupedByX),
    grid: getGrids(conf, data),
    visualMap: [
      {
        min: 0,
        max: 1,
        calculable: true,
        show: false,
        seriesIndex: 0,
        color: ['#fff', '#418AAF'],
      },
    ],
  };
  return defaultsDeep({}, customOptions, defaultOption);
}

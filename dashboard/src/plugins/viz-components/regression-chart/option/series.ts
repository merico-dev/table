import _ from 'lodash';
import { AnyObject } from '~/types';
import { IRegressionChartConf } from '../type';

export type TSeriesConf = AnyObject[];

function makeXYData(conf: IRegressionChartConf, data: TVizData) {
  return _.uniqBy(
    data.map((d) => [d[conf.x_axis.data_key], d[conf.regression.y_axis_data_key]]),
    0,
  );
}

function makeSingleSeries(conf: IRegressionChartConf, data: TVizData): TSeriesConf {
  return [
    {
      type: 'scatter',
      name: conf.y_axis.name,
      data: makeXYData(conf, data),
      symbolSize: 4,
      color: 'red',
    },
  ];
}

function makeSplittedSeries(conf: IRegressionChartConf, data: TVizData): TSeriesConf {
  const { group_by_key } = conf.regression;
  const groupedData = _.groupBy(data, group_by_key);
  return Object.entries(groupedData).map(([key, partialData]) => {
    return {
      type: 'scatter',
      name: key,
      data: makeXYData(conf, partialData),
      symbolSize: 4,
    };
  });
}

export function getSeries(conf: IRegressionChartConf, data: TVizData): TSeriesConf {
  if (data.length === 0) {
    return [];
  }
  const { group_by_key } = conf.regression;

  if (!group_by_key) {
    return makeSingleSeries(conf, data);
  }

  return makeSplittedSeries(conf, data);
}

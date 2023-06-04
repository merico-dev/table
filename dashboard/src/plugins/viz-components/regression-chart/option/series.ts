import _ from 'lodash';
import { AnyObject } from '~/types';
import { IRegressionChartConf } from '../type';
import { getRegressionDataSource } from '~/plugins/common-echarts-fields/regression-line';

export type TSeriesConf = AnyObject[];

function makeXYData(conf: IRegressionChartConf, data: TVizData) {
  return _.uniqBy(
    data.map((d) => [d[conf.x_axis.data_key], d[conf.regression.y_axis_data_key]]),
    0,
  );
}

function makeSingleSeries(conf: IRegressionChartConf, data: TVizData): TSeriesConf {
  const { plot, transform } = conf.regression;
  const seriesData = makeXYData(conf, data);
  return [
    {
      type: 'scatter',
      name: conf.y_axis.name,
      data: seriesData,
      symbolSize: 4,
      color: 'red',
      markLine: {
        ...plot,
        data: [getRegressionDataSource(transform, seriesData)],
        color: 'blue',
        smooth: true,
        silent: true,
        symbol: ['none', 'none'],
      },
    },
  ];
}

function makeSplittedSeries(conf: IRegressionChartConf, data: TVizData): TSeriesConf {
  const { plot, transform, group_by_key } = conf.regression;
  const groupedData = _.groupBy(data, group_by_key);
  return Object.entries(groupedData).map(([key, partialData]) => {
    const seriesData = makeXYData(conf, partialData);
    return {
      type: 'scatter',
      name: key,
      data: seriesData,
      symbolSize: 4,
      markLine: {
        ...plot,
        data: [getRegressionDataSource(transform, seriesData)],
        smooth: true,
        silent: true,
        symbol: ['none', 'none'],
      },
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

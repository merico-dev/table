import _ from 'lodash';
import { AnyObject } from '~/types';
import { IRegressionChartConf } from '../type';
import { getRegressionDataSource } from '~/components/plugins/common-echarts-fields/regression-line';
import { parseDataKey } from '~/utils';

export type TSeriesConf = AnyObject[];

function makeXYData(conf: IRegressionChartConf, queryData: TQueryData) {
  const x = parseDataKey(conf.x_axis.data_key);
  const y = parseDataKey(conf.regression.y_axis_data_key);
  return _.uniqBy(
    queryData.map((d) => [d[x.columnKey], d[y.columnKey]]),
    0,
  );
}

function makeSingleSeries(conf: IRegressionChartConf, queryData: TQueryData): TSeriesConf {
  const { plot, transform } = conf.regression;
  const seriesData = makeXYData(conf, queryData);
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

function makeSplittedSeries(conf: IRegressionChartConf, queryData: TQueryData): TSeriesConf {
  const { plot, transform, group_by_key } = conf.regression;
  const g = parseDataKey(group_by_key);
  const groupedData = _.groupBy(queryData, g.columnKey);
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

export function getSeries(conf: IRegressionChartConf, queryData: TQueryData): TSeriesConf {
  if (queryData.length === 0) {
    return [];
  }
  const { group_by_key } = conf.regression;

  if (!group_by_key) {
    return makeSingleSeries(conf, queryData);
  }

  return makeSplittedSeries(conf, queryData);
}

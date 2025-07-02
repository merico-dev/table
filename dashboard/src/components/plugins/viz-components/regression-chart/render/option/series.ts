import _ from 'lodash';
import { getRegressionDataSource } from '~/components/plugins/common-echarts-fields/regression-line';
import { AnyObject } from '~/types';
import { parseDataKey, ParsedDataKey } from '~/utils';
import { IRegressionChartConf } from '../../type';

export type TSeriesConf = AnyObject[];

function makeXYData(conf: IRegressionChartConf, queryData: TQueryData, x: ParsedDataKey, y: ParsedDataKey) {
  return _.uniqBy(
    queryData.map((d) => [d[x.columnKey], d[y.columnKey]]),
    0,
  );
}

function makeSingleSeries(
  conf: IRegressionChartConf,
  queryData: TQueryData,
  x: ParsedDataKey,
  y: ParsedDataKey,
): TSeriesConf {
  const { plot, transform } = conf.regression;
  const seriesData = makeXYData(conf, queryData, x, y);
  return [
    {
      type: 'scatter',
      name: '',
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

function makeSplittedSeries(
  conf: IRegressionChartConf,
  queryData: TQueryData,
  x: ParsedDataKey,
  y: ParsedDataKey,
  g: ParsedDataKey,
): TSeriesConf {
  const { plot, transform } = conf.regression;
  const groupedData = _.groupBy(queryData, g.columnKey);
  return Object.entries(groupedData).map(([key, partialData]) => {
    const seriesData = makeXYData(conf, partialData, x, y);
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

export function getSeries(
  conf: IRegressionChartConf,
  rawData: TPanelData,
  x: ParsedDataKey,
  y: ParsedDataKey,
  g: ParsedDataKey,
): TSeriesConf {
  const queryData = rawData[x.queryID];

  if (!g.columnKey || !g.queryID) {
    return makeSingleSeries(conf, queryData, x, y);
  }

  return makeSplittedSeries(conf, queryData, x, y, g);
}

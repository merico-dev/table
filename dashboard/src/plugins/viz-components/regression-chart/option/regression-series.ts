import { IRegressionLineConf, IRegressionTransform } from '../../cartesian/type';
import { IRegressionChartConf } from '../type';
// @ts-expect-error type lib for d3-regression
import * as d3Regression from 'd3-regression';

interface IRegressionSeriesItem extends IRegressionLineConf {
  data: number[][];
  name: string;
  showSymbol: boolean;
  tooltip: Record<string, $TSFixMe>;
  smooth: boolean;
}

function getRegressionDataSource(transform: IRegressionTransform, rawData: $TSFixMe[][]) {
  switch (transform.config.method) {
    case 'linear':
      return [...d3Regression.regressionLinear()(rawData)];
    case 'exponential':
      return [...d3Regression.regressionExp()(rawData)];
    case 'logarithmic':
      return [...d3Regression.regressionLog()(rawData)];
    case 'polynomial':
      return [...d3Regression.regressionPoly().order(transform.config.order)(rawData)];
    default:
      return [];
  }
}

export function getRegressionConf({ regression }: IRegressionChartConf, data: number[][]) {
  const regressionSeries: IRegressionSeriesItem[] = [];
  const regressionXAxes: Record<string, $TSFixMe>[] = [];
  if (data.length === 0) {
    return { regressionSeries, regressionXAxes };
  }
  const { transform, plot, name } = regression;

  const dataSource = getRegressionDataSource(transform, data);
  regressionSeries.push({
    ...plot,
    name,
    data: dataSource,
    showSymbol: false,
    smooth: true,
    tooltip: {
      show: false,
    },
  });

  return { regressionSeries, regressionXAxes };
}

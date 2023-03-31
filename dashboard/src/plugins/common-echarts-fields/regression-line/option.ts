// @ts-expect-error type lib for d3-regression
import * as d3Regression from 'd3-regression';
import { IRegressionTransform } from './types';

export function getRegressionDataSource(transform: IRegressionTransform, rawData: $TSFixMe[][]) {
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

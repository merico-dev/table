import { Group, Text } from '@mantine/core';
import { IRegressionChartConf } from '../../../type';
// @ts-expect-error type lib for d3-regression
import * as d3Regression from 'd3-regression';
import _ from 'lodash';
import { ReactNode } from 'react';
import { ParsedDataKey, TNumberFormat, formatNumber, parseDataKey } from '~/utils';

export type TDescription = {
  name: string;
  expression: ReactNode;
  rSquared: number;
  adjustedRSquared: number;
};

const numberFormat: TNumberFormat = { output: 'number', mantissa: 2, trimMantissa: true, absolute: false };
/**
 * calculate Adjusted RSquared
 * @param r RSquared
 * @param n The number of observations
 * @param k The number of predictor variables
 * @returns Adjusted RSquared
 */
function calculateAdjustedRSquared(r: number, n: number, k: number) {
  return 1 - ((1 - r) * (n - 1)) / (n - k - 1);
}

function getLinearDescription(
  name: string,
  queryData: TQueryData,
  basisData: [number, number][],
  x: ParsedDataKey,
  y: ParsedDataKey,
): TDescription {
  const result = d3Regression.regressionLinear()(basisData);
  const { a, b, rSquared } = result;
  return {
    name,
    expression: (
      <Group justify="center" wrap="nowrap" gap={10}>
        <Text size="sm">{y.columnKey}</Text>
        <Text size="sm">=</Text>
        <Text size="sm" fw="bold" c="red">
          {formatNumber(b, numberFormat)}
        </Text>
        <Text size="sm">+</Text>
        <Text size="sm" fw="bold" c="red">
          {formatNumber(a, numberFormat)}
        </Text>
        <Text size="sm">×</Text>
        <Text size="sm">{x.columnKey}</Text>
      </Group>
    ),
    rSquared,
    adjustedRSquared: calculateAdjustedRSquared(rSquared, queryData.length, 1),
  };
}

function getExponentialDescription(
  name: string,
  queryData: TQueryData,
  basisData: [number, number][],
  x: ParsedDataKey,
  y: ParsedDataKey,
): TDescription {
  const { a, b, rSquared } = d3Regression.regressionExp()(basisData);
  return {
    name,
    expression: (
      <Group justify="center" wrap="nowrap" gap={10}>
        <Text size="sm">{y.columnKey}</Text>
        <Text size="sm">=</Text>
        <Text size="sm" fw="bold" c="gray">
          {a}
        </Text>
        <Text size="sm">×</Text>
        <Group justify="flex-start" wrap="nowrap" gap={2}>
          <Text size="sm">Math.exp(</Text>
          <Text size="sm" fw="bold" c="gray">
            {b}
          </Text>
          <Text size="sm">×</Text>
          <Text size="sm">{x.columnKey}</Text>
          <Text size="sm">)</Text>
        </Group>
      </Group>
    ),
    rSquared,
    adjustedRSquared: calculateAdjustedRSquared(rSquared, queryData.length, 1),
  };
}

function getLogisticDescription(
  name: string,
  queryData: TQueryData,
  basisData: [number, number][],
  x: ParsedDataKey,
  y: ParsedDataKey,
): TDescription {
  const { a, b, rSquared } = d3Regression.regressionLog()(basisData);
  return {
    name,
    expression: (
      <Group justify="center" wrap="nowrap" gap={10}>
        <Text size="sm">{y.columnKey}</Text>
        <Text size="sm">=</Text>
        <Text size="sm" fw="bold" c="gray">
          {a}
        </Text>
        <Text size="sm">×</Text>
        <Group justify="flex-start" wrap="nowrap" gap={2}>
          <Text size="sm">Math.log(</Text>
          <Text size="sm">{x.columnKey}</Text>
          <Text size="sm">)</Text>
          <Text size="sm">+</Text>
          <Text size="sm" fw="bold" c="gray">
            {b}
          </Text>
        </Group>
      </Group>
    ),
    rSquared,
    adjustedRSquared: calculateAdjustedRSquared(rSquared, queryData.length, 1),
  };
}

function getPolynomialDescription(
  name: string,
  queryData: TQueryData,
  basisData: [number, number][],
  conf: IRegressionChartConf,
): TDescription {
  const { regression } = conf;
  const result = d3Regression.regressionPoly().order(regression.transform.config.order)(basisData);
  const { rSquared } = result;
  console.log(result);
  return {
    name,
    expression: '',
    rSquared,
    adjustedRSquared: calculateAdjustedRSquared(rSquared, queryData.length, 1),
  };
}

function getDescription(
  name: string,
  queryData: TQueryData,
  conf: IRegressionChartConf,
  x: ParsedDataKey,
  y: ParsedDataKey,
): TDescription {
  const { regression } = conf;
  const dataSource: [number, number][] = queryData.map((d) => [d[x.columnKey], d[y.columnKey]]);

  if (regression.transform.config.method === 'linear') {
    return getLinearDescription(name, queryData, dataSource, x, y);
  }
  if (regression.transform.config.method === 'exponential') {
    return getExponentialDescription(name, queryData, dataSource, x, y);
  }

  if (regression.transform.config.method === 'logistic') {
    return getLogisticDescription(name, queryData, dataSource, x, y);
  }
  if (regression.transform.config.method === 'polynomial') {
    return getPolynomialDescription(name, queryData, dataSource, conf);
  }
  return {
    name,
    expression: '',
    rSquared: 0,
    adjustedRSquared: 0,
  };
}

export function getRegressionDescription(
  queryData: TQueryData,
  x: ParsedDataKey,
  y: ParsedDataKey,
  g: ParsedDataKey,
  conf?: IRegressionChartConf,
): TDescription[] {
  if (!conf) {
    return [
      {
        name: '',
        expression: '',
        rSquared: 0,
        adjustedRSquared: 0,
      },
    ];
  }
  if (!g.columnKey || !g.queryID) {
    return [getDescription('', queryData, conf, x, y)];
  }

  const groupedData = _.groupBy(queryData, g.columnKey);
  return Object.entries(groupedData).map(([group, subData]) => {
    return getDescription(group, subData, conf, x, y);
  });
}

import { Group, Text } from '@mantine/core';
import { IRegressionChartConf } from '../../type';
// @ts-expect-error type lib for d3-regression
import * as d3Regression from 'd3-regression';
import numbro from 'numbro';

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

function getLinearDescription(rawData: TVizData, basisData: [number, number][], conf: IRegressionChartConf) {
  const { x_axis, y_axis } = conf;
  const result = d3Regression.regressionLinear()(basisData);
  const { a, b, rSquared } = result;
  return {
    expression: (
      <Group position="center" noWrap spacing={10}>
        <Text>{y_axis.name}</Text>
        <Text>=</Text>
        <Text weight="bold" color="red">
          {numbro(b).format({ mantissa: 2, trimMantissa: true })}
        </Text>
        <Text>+</Text>
        <Text weight="bold" color="red">
          {numbro(a).format({ mantissa: 2, trimMantissa: true })}
        </Text>
        <Text>×</Text>
        <Text>{x_axis.name}</Text>
      </Group>
    ),
    rSquared,
    adjustedRSquared: calculateAdjustedRSquared(rSquared, rawData.length, 1),
  };
}

function getExponentialDescription(rawData: TVizData, basisData: [number, number][], conf: IRegressionChartConf) {
  const { x_axis, y_axis } = conf;
  const { a, b, rSquared } = d3Regression.regressionExp()(basisData);
  return {
    expression: (
      <Group position="center" noWrap spacing={10}>
        <Text>{y_axis.name}</Text>
        <Text>=</Text>
        <Text weight="bold" color="gray">
          {a}
        </Text>
        <Text>×</Text>
        <Group position="left" noWrap spacing={2}>
          <Text>Math.exp(</Text>
          <Text weight="bold" color="gray">
            {b}
          </Text>
          <Text>×</Text>
          <Text>{x_axis.name}</Text>
          <Text>)</Text>
        </Group>
      </Group>
    ),
    rSquared,
    adjustedRSquared: calculateAdjustedRSquared(rSquared, rawData.length, 1),
  };
}

function getLogarithmicDescription(rawData: TVizData, basisData: [number, number][], conf: IRegressionChartConf) {
  const { x_axis, y_axis } = conf;
  const { a, b, rSquared } = d3Regression.regressionLog()(basisData);
  return {
    expression: (
      <Group position="center" noWrap spacing={10}>
        <Text>{y_axis.name}</Text>
        <Text>=</Text>
        <Text weight="bold" color="gray">
          {a}
        </Text>
        <Text>×</Text>
        <Group position="left" noWrap spacing={2}>
          <Text>Math.log(</Text>
          <Text>{x_axis.name}</Text>
          <Text>)</Text>
          <Text>+</Text>
          <Text weight="bold" color="gray">
            {b}
          </Text>
        </Group>
      </Group>
    ),
    rSquared,
    adjustedRSquared: calculateAdjustedRSquared(rSquared, rawData.length, 1),
  };
}

function getPolynomialDescription(rawData: TVizData, basisData: [number, number][], conf: IRegressionChartConf) {
  const { x_axis, y_axis, regression } = conf;
  const result = d3Regression.regressionPoly().order(regression.transform.config.order)(basisData);
  const { rSquared } = result;
  console.log(result);
  return {
    expression: '',
    rSquared,
    adjustedRSquared: calculateAdjustedRSquared(rSquared, rawData.length, 1),
  };
}

export function getRegressionDescription(data: TVizData, conf?: IRegressionChartConf) {
  if (!conf) {
    return {
      expression: '',
      rSquared: 0,
      adjustedRSquared: 0,
    };
  }
  const { regression, x_axis, y_axis } = conf;
  const dataSource: [number, number][] = data.map((d) => [d[x_axis.data_key], d[regression.y_axis_data_key]]);

  if (regression.transform.config.method === 'linear') {
    return getLinearDescription(data, dataSource, conf);
  }
  if (regression.transform.config.method === 'exponential') {
    return getExponentialDescription(data, dataSource, conf);
  }

  if (regression.transform.config.method === 'logarithmic') {
    return getLogarithmicDescription(data, dataSource, conf);
  }
  if (regression.transform.config.method === 'polynomial') {
    return getPolynomialDescription(data, dataSource, conf);
  }
  return {
    expression: '',
    rSquared: 0,
    adjustedRSquared: 0,
  };
}

import { IRegressionLineConf, IRegressionTransform } from '../../cartesian/type';
import { IRegressionChartConf } from '../type';
import { Group, Text } from '@mantine/core';
import ecStat, { RegressionResult } from 'echarts-stat';
// @ts-expect-error type lib for d3-regression
import * as d3Regression from 'd3-regression';
import { round } from 'lodash';

interface IRegressionDataSetItem {
  id: string;
  fromDatasetId?: string;
  source?: number[][];
  transform?: IRegressionTransform;
}
interface IRegressionSeriesItem extends IRegressionLineConf {
  datasetId: string;
  xAxisId: string;
  name: string;
  showSymbol: boolean;
  tooltip: Record<string, any>;
}

export function getRegressionConf({ regression, x_axis }: IRegressionChartConf, data: any[]) {
  const regressionDataSets: IRegressionDataSetItem[] = [];
  const regressionSeries: IRegressionSeriesItem[] = [];
  const regressionXAxes: Record<string, any>[] = [];
  if (data.length === 0) {
    return { regressionDataSets, regressionSeries, regressionXAxes };
  }
  const { transform, plot, name, y_axis_data_key } = regression;
  const xAxisId = `x-axis-for-${name}`;
  const rawDatasetId = `dataset-for-${name}--raw`;
  const regDatasetId = `dataset-for-${name}--transformed`;

  regressionDataSets.push({
    id: rawDatasetId,
    source: data.map((d) => [d[x_axis.data_key], d[y_axis_data_key]]),
  });
  regressionDataSets.push({
    transform,
    id: regDatasetId,
    fromDatasetId: rawDatasetId,
  });
  regressionSeries.push({
    ...plot,
    name,
    datasetId: regDatasetId,
    xAxisId,
    showSymbol: false,
    tooltip: {
      show: false,
    },
  });
  regressionXAxes.push({
    type: 'category',
    id: xAxisId,
    datasetId: regDatasetId,
    show: false,
  });

  return { regressionDataSets, regressionSeries, regressionXAxes };
}

export function getRegressionDescription(data: any[], conf?: IRegressionChartConf) {
  if (!conf) {
    return {
      expression: '',
      gradient: 0,
      intercept: 0,
    };
  }
  const { regression, x_axis, y_axis } = conf;
  const dataSource = data.map((d) => [d[x_axis.data_key], d[regression.y_axis_data_key]]);

  if (regression.transform.config.method === 'linear') {
    const result = d3Regression.regressionLinear()(dataSource);
    const { a, b, rSquared } = result;
    return {
      expression: (
        <Group position="center" noWrap spacing={10}>
          <Text>{y_axis.name}</Text>
          <Text>=</Text>
          <Text weight="bold" color="gray">
            {b}
          </Text>
          <Text>+</Text>
          <Text weight="bold" color="gray">
            {a}
          </Text>
          <Text>×</Text>
          <Text>{x_axis.name}</Text>
        </Group>
      ),
      rSquared,
    };
  }
  if (regression.transform.config.method === 'exponential') {
    const { a, b, rSquared } = d3Regression.regressionExp()(dataSource);
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
    };
  }

  if (regression.transform.config.method === 'logarithmic') {
    const { a, b, rSquared } = d3Regression.regressionLog()(dataSource);
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
    };
  }
  if (regression.transform.config.method === 'polynomial') {
    const result = d3Regression.regressionPoly().order(regression.transform.config.order)(dataSource);
    const { rSquared } = result;
    console.log(result);
    return {
      expression: '',
      rSquared,
    };
  }
  return {
    expression: '',
    rSquared: 0,
  };
}

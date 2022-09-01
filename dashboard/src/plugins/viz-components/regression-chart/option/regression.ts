import { IRegressionLineConf, IRegressionTransform } from '../../cartesian/type';
import { IRegressionChartConf } from '../type';
import ecStat, { RegressionResult } from 'echarts-stat';
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

export function getRegressionDescription({ regression, x_axis, y_axis }: IRegressionChartConf, data: any[]) {
  const dataSource = data.map((d) => [d[x_axis.data_key], d[regression.y_axis_data_key]]);

  const {
    // @ts-expect-error echarts-stat is outdated on type definition
    parameter: { gradient, intercept },
  }: RegressionResult = ecStat.regression(
    regression.transform.config.method,
    dataSource,
    regression.transform.config.order,
  );

  return {
    expression: `${y_axis.name} = ${round(intercept, 2)} + ${round(gradient, 2)} × ${x_axis.name}`,
    gradient,
    intercept,
  };
}

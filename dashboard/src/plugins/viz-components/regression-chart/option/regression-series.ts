import { getRegressionDataSource, IRegressionSeriesItem } from '~/plugins/common-echarts-fields/regression-line';
import { IRegressionChartConf } from '../type';

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
    custom: {
      type: 'regression-line',
      targetSeries: name,
    },
  });

  return { regressionSeries, regressionXAxes };
}

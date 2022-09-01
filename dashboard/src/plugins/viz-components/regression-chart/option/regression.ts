import { IRegressionLineConf, IRegressionTransform } from '../../cartesian/type';
import { IRegressionChartConf } from '../type';

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

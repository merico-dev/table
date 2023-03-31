import { ICartesianChartConf, IRegressionLineConf, IRegressionTransform } from '../type';

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
  tooltip: Record<string, $TSFixMe>;
}
interface IRegressionXAxisItem {
  type: 'category';
  id: string;
  datasetId: string;
  show: false;
}

export function getRegressionConfs({ regressions = [] }: ICartesianChartConf, data: TVizData) {
  const regressionDataSets: IRegressionDataSetItem[] = [];
  const regressionSeries: IRegressionSeriesItem[] = [];
  const regressionXAxes: IRegressionXAxisItem[] = [];
  if (data.length === 0) {
    return { regressionDataSets, regressionSeries, regressionXAxes };
  }
  regressions.forEach(({ transform, plot, name, y_axis_data_key }) => {
    const xAxisId = `x-axis-for-${name}`;
    const rawDatasetId = `dataset-for-${name}--raw`;
    const regDatasetId = `dataset-for-${name}--transformed`;

    regressionDataSets.push({
      id: rawDatasetId,
      source: data.map((d, i) => [i, Number(d[y_axis_data_key])]),
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
  });

  return { regressionDataSets, regressionSeries, regressionXAxes };
}

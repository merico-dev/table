import { ICartesianChartConf, IRegressionConf, IRegressionLineConf, IRegressionTransform } from '../type';

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

function getOneRegressionConf(reg: IRegressionConf, data: TVizData) {
  const { transform, plot, name, y_axis_data_key } = reg;
  const xAxisId = `x-axis-for-${name}`;
  const rawDatasetId = `dataset-for-${name}--raw`;
  const regDatasetId = `dataset-for-${name}--transformed`;

  const datasets = [
    {
      id: rawDatasetId,
      source: data.map((d, i) => [i, Number(d[y_axis_data_key])]),
    },
    {
      transform,
      id: regDatasetId,
      fromDatasetId: rawDatasetId,
    },
  ];
  const series = {
    ...plot,
    name,
    datasetId: regDatasetId,
    xAxisId,
    showSymbol: false,
    tooltip: {
      show: false,
    },
  };
  const xaxis: IRegressionXAxisItem = {
    type: 'category',
    id: xAxisId,
    datasetId: regDatasetId,
    show: false,
  };

  return {
    datasets,
    series: [series],
    xaxes: [xaxis],
  };
}

export function getRegressionConfs({ regressions = [] }: ICartesianChartConf, data: TVizData) {
  const regressionDataSets: IRegressionDataSetItem[] = [];
  const regressionSeries: IRegressionSeriesItem[] = [];
  const regressionXAxes: IRegressionXAxisItem[] = [];
  if (data.length === 0) {
    return { regressionDataSets, regressionSeries, regressionXAxes };
  }

  regressions.forEach((reg) => {
    const { datasets, series, xaxes } = getOneRegressionConf(reg, data);
    regressionDataSets.push(...datasets);
    regressionSeries.push(...series);
    regressionXAxes.push(...xaxes);
  });

  return { regressionDataSets, regressionSeries, regressionXAxes };
}

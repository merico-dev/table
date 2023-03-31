import _ from 'lodash';
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

function getOneRegressionConf(reg: IRegressionConf, name: string, data: TVizData) {
  const { transform, plot, y_axis_data_key } = reg;
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

export function getRegressionConfs({ regressions = [], x_axis_data_key }: ICartesianChartConf, data: TVizData) {
  const regressionDataSets: IRegressionDataSetItem[] = [];
  const regressionSeries: IRegressionSeriesItem[] = [];
  const regressionXAxes: IRegressionXAxisItem[] = [];
  if (data.length === 0) {
    return { regressionDataSets, regressionSeries, regressionXAxes };
  }

  function getAndApplyConf(reg: IRegressionConf, name: string, data: TVizData) {
    const { datasets, series, xaxes } = getOneRegressionConf(reg, name, data);
    regressionDataSets.push(...datasets);
    regressionSeries.push(...series);
    regressionXAxes.push(...xaxes);
  }

  regressions.forEach((reg) => {
    const { name, group_by_key } = reg;
    if (!group_by_key || group_by_key === x_axis_data_key) {
      getAndApplyConf(reg, name, data);
      return;
    }
    const groupedData = _.groupBy(data, group_by_key);
    Object.entries(groupedData).forEach(([k, subData]) => {
      const subName = `${name} (${k})`;
      getAndApplyConf(reg, subName, subData as TVizData);
    });
  });

  return { regressionDataSets, regressionSeries, regressionXAxes };
}

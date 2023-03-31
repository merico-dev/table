import _ from 'lodash';
import {
  getRegressionDataSource,
  IRegressionSeriesItem,
  TDataForReg,
} from '~/plugins/common-echarts-fields/regression-line';
import { ICartesianChartConf, IRegressionConf } from '../type';

function getOneRegressionConf(reg: IRegressionConf, name: string, data: TDataForReg) {
  const { transform, plot } = reg;
  // TODO: use the same color as the original series
  const series = {
    ...plot,
    name,
    data: getRegressionDataSource(transform, data),
    showSymbol: false,
    tooltip: {
      show: false,
    },
  };

  return {
    series: [series],
    xaxes: [],
  };
}

export function getRegressionConfs({ regressions = [], x_axis_data_key }: ICartesianChartConf, rawData: TVizData) {
  const regressionSeries: IRegressionSeriesItem[] = [];
  if (rawData.length === 0) {
    return { regressionSeries };
  }

  function getAndApplyConf(reg: IRegressionConf, name: string, data: TDataForReg) {
    const { series } = getOneRegressionConf(reg, name, data);
    regressionSeries.push(...series);
  }

  regressions.forEach((reg) => {
    const { name, group_by_key } = reg;
    if (!group_by_key || group_by_key === x_axis_data_key) {
      const data = rawData.map((d, i) => [i, Number(d[reg.y_axis_data_key])]);
      getAndApplyConf(reg, name, data);
      return;
    }
    const groupedData = _.groupBy(rawData, group_by_key);
    Object.entries(groupedData).forEach(([k, subRawData]) => {
      const subData: TDataForReg = subRawData.map((d, i) => [i, Number(d[reg.y_axis_data_key])]);
      const subName = `${name} (${k})`;
      getAndApplyConf(reg, subName, subData);
    });
  });

  return { regressionSeries };
}

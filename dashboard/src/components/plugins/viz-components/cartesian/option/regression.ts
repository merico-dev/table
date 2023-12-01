import _ from 'lodash';
import {
  getRegressionDataSource,
  IRegressionSeriesItem,
  TDataForReg,
} from '~/components/plugins/common-echarts-fields/regression-line';
import { ICartesianChartConf, IRegressionConf } from '../type';
import { extractData, extractFullQueryData, parseDataKey } from '~/utils';

function getOneRegressionConf(reg: IRegressionConf, name: string, targetSeries: string, data: TDataForReg) {
  const { transform, plot } = reg;
  const series = {
    ...plot,
    name,
    data: getRegressionDataSource(transform, data),
    showSymbol: false,
    tooltip: {
      show: false,
    },
    smooth: false,
    custom: {},
  };
  if (targetSeries) {
    series.custom = {
      type: 'regression-line',
      targetSeries,
    };
  }

  return series;
}

export function getRegressionConfs({ regressions = [], x_axis_data_key }: ICartesianChartConf, rawData: TPanelData) {
  const regressionSeries: IRegressionSeriesItem[] = [];
  if (Object.keys(rawData).length === 0) {
    return regressionSeries;
  }

  function getAndApplyConf(reg: IRegressionConf, name: string, targetSeries: string, data: TDataForReg) {
    const series = getOneRegressionConf(reg, name, targetSeries, data);
    regressionSeries.push(series);
  }

  regressions.forEach((reg) => {
    const { name, group_by_key } = reg;
    if (!group_by_key || group_by_key === x_axis_data_key) {
      const columnData = extractData(rawData, reg.y_axis_data_key);
      const data = columnData.map((d, i) => [i, Number(d)]);
      getAndApplyConf(reg, name, '', data);
      return;
    }
    const { columnKey } = parseDataKey(reg.y_axis_data_key);
    const groupedData = _.groupBy(extractFullQueryData(rawData, reg.y_axis_data_key), group_by_key);
    Object.entries(groupedData).forEach(([k, subRawData]) => {
      const subData: TDataForReg = subRawData.map((d, i) => [i, Number(d[columnKey])]);
      const subName = k;
      getAndApplyConf(reg, subName, k, subData);
    });
  });

  return regressionSeries;
}

import { getRegressionDataSource, IRegressionSeriesItem } from '~/plugins/common-echarts-fields/regression-line';
import { IRegressionChartConf } from '../type';
import _ from 'lodash';
import { TSeriesConf } from './series';

type TGetRegressionConfRet = IRegressionSeriesItem[];

export function getRegressionConf(conf: IRegressionChartConf, series: TSeriesConf): TGetRegressionConfRet {
  const { plot, transform } = conf.regression;
  return series.map((s) => {
    return {
      ...plot,
      name: `reg-for-${s.name}`,
      data: getRegressionDataSource(transform, s.data),
      color: s.color,
      showSymbol: false,
      smooth: true,
      tooltip: {
        show: false,
      },
      custom: {
        type: 'regression-line',
        targetSeries: s.name,
      },
    };
  });
}

import { IRegressionConf } from '../cartesian/type';

export interface IRegressionChartConf {
  x_axis: {
    data_key: TDataKey;
  };
  regression: IRegressionConf;
}

export const getDefaultConfig = (): IRegressionChartConf => ({
  x_axis: {
    data_key: '',
  },
  regression: {
    transform: {
      type: 'ecStat:regression',
      config: {
        method: 'linear',
        order: 1,
        formulaOn: 'end',
      },
    },
    plot: {
      type: 'line',
      yAxisIndex: 0,
      color: '#228be6',
      lineStyle: {
        type: 'solid',
        width: 1,
      },
    },
    name: 'regression',
    group_by_key: '',
    y_axis_data_key: 'value',
  },
});

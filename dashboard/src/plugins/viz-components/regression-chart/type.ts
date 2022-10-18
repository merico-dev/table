import { IRegressionConf } from '../cartesian/type';

export interface IRegressionChartConf {
  x_axis: {
    name: string;
    data_key: string;
  };
  y_axis: {
    name: string;
  };
  regression: IRegressionConf;
}

export const DEFAULT_CONFIG: IRegressionChartConf = {
  x_axis: {
    name: 'X Axis',
    data_key: '',
  },
  y_axis: {
    name: 'Y Axis',
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
    y_axis_data_key: 'value',
  },
};

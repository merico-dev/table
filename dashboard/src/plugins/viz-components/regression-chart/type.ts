import {
  DEFAULT_X_AXIS_LABEL_FORMATTER,
  IXAxisLabelFormatter,
} from '~/plugins/common-echarts-fields/x-axis-label-formatter/types';
import { IRegressionConf } from '../cartesian/type';
import { DEFAULT_AXIS_LABEL_OVERFLOW, IAxisLabelOverflow } from '~/plugins/common-echarts-fields/axis-label-overflow';

export interface IRegressionChartConf {
  x_axis: {
    name: string;
    data_key: string;
    axisLabel: {
      rotate: number;
      formatter: IXAxisLabelFormatter;
      overflow: IAxisLabelOverflow;
    };
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
    axisLabel: {
      rotate: 0,
      formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
      overflow: DEFAULT_AXIS_LABEL_OVERFLOW,
    },
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
    group_by_key: '',
    y_axis_data_key: 'value',
  },
};

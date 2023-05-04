import {
  DEFAULT_X_AXIS_LABEL_FORMATTER,
  IXAxisLabelFormatter,
} from '~/plugins/common-echarts-fields/x-axis-label-formatter/types';

export interface IMericoEstimationChartConf {
  x_axis: {
    data_key: string;
    name: string;
    axisLabel: {
      rotate: number;
      formatter: IXAxisLabelFormatter;
    };
  };
  y_axis: {
    name: string;
    data_keys: {
      estimated_value: string;
      actual_value: string;
    };
  };
}

export const DEFAULT_CONFIG: IMericoEstimationChartConf = {
  x_axis: {
    name: '',
    data_key: '',
    axisLabel: {
      rotate: 0,
      formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
    },
  },
  y_axis: {
    name: '',
    data_keys: {
      estimated_value: '',
      actual_value: '',
    },
  },
};

import {
  DEFAULT_X_AXIS_LABEL_FORMATTER,
  IXAxisLabelFormatter,
} from '~/components/plugins/common-echarts-fields/x-axis-label-formatter/types';
import { IRegressionConf } from '../cartesian/type';
import {
  DEFAULT_AXIS_LABEL_OVERFLOW,
  IAxisLabelOverflow,
} from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { TNumbroFormat, defaultNumbroFormat } from '~/components/panel/settings/common/numbro-format-selector';

export interface IRegressionChartConf {
  x_axis: {
    name: string;
    data_key: TDataKey;
    axisLabel: {
      rotate: number;
      format: TNumbroFormat;
      overflow: IAxisLabelOverflow;
      formatter: IXAxisLabelFormatter;
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
      format: defaultNumbroFormat,
      overflow: DEFAULT_AXIS_LABEL_OVERFLOW,
      formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
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

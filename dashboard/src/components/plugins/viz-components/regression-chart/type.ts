import {
  getDefaultAxisLabelOverflow,
  IAxisLabelOverflow,
} from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import {
  getDefaultXAxisLabelFormatter,
  IXAxisLabelFormatter,
} from '~/components/plugins/common-echarts-fields/x-axis-label-formatter';
import { defaultNumberFormat, TNumberFormat } from '~/utils';
import { IRegressionConf } from '../cartesian/type';

export interface IRegressionChartConf {
  x_axis: {
    name: string;
    data_key: TDataKey;
    axisLabel: {
      rotate: number;
      format: TNumberFormat;
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
      format: defaultNumberFormat,
      overflow: getDefaultAxisLabelOverflow(),
      formatter: getDefaultXAxisLabelFormatter(),
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

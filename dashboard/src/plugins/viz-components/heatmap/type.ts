import { defaultNumbroFormat, TNumbroFormat } from '~/panel/settings/common/numbro-format-selector';
import {
  DEFAULT_X_AXIS_LABEL_FORMATTER,
  IXAxisLabelFormatter,
} from '../cartesian/panel/x-axis/x-axis-label-formatter/types';
import {
  DEFAULT_X_AXIS_LABEL_OVERFLOW,
  IXAxisLabelOverflow,
} from '../cartesian/panel/x-axis/x-axis-label-overflow/types';
import { IScatterTooltipMetric } from '../scatter-chart/type';

export interface IHeatmapConf {
  x_axis: {
    name: string;
    data_key: string;
    axisLabel: {
      rotate: number;
      formatter: IXAxisLabelFormatter;
      overflow: IXAxisLabelOverflow;
    };
  };
  y_axis: {
    name: string;
    data_key: string;
    nameAlignment: 'left' | 'center' | 'right';
    axisLabel: {
      rotate: number;
      formatter: IXAxisLabelFormatter;
      overflow: IXAxisLabelOverflow;
    };
  };
  heat_block: {
    data_key: '';
    name: string;
    value_formatter: TNumbroFormat;
  };
  tooltip: {
    metrics: IScatterTooltipMetric[];
  };
}

export const DEFAULT_CONFIG: IHeatmapConf = {
  x_axis: {
    name: '',
    data_key: '',
    axisLabel: {
      rotate: 0,
      overflow: DEFAULT_X_AXIS_LABEL_OVERFLOW,
      formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
    },
  },
  y_axis: {
    name: 'Y Axis',
    data_key: '',
    nameAlignment: 'center',
    axisLabel: {
      rotate: 0,
      overflow: DEFAULT_X_AXIS_LABEL_OVERFLOW,
      formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
    },
  },
  heat_block: {
    data_key: '',
    name: 'Value',
    value_formatter: defaultNumbroFormat,
  },
  tooltip: {
    metrics: [],
  },
};

import { defaultNumbroFormat, TNumbroFormat } from '~/panel/settings/common/numbro-format-selector';
import { DEFAULT_AXIS_LABEL_OVERFLOW, IAxisLabelOverflow } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { IEchartsTooltipMetric } from '~/plugins/common-echarts-fields/tooltip-metric';
import {
  DEFAULT_X_AXIS_LABEL_FORMATTER,
  IXAxisLabelFormatter,
} from '../cartesian/editors/x-axis/x-axis-label-formatter/types';

export interface IHeatmapConf {
  x_axis: {
    name: string;
    data_key: TDataKey;
    axisLabel: {
      rotate: number;
      formatter: IXAxisLabelFormatter;
      overflow: IAxisLabelOverflow;
    };
  };
  y_axis: {
    name: string;
    data_key: TDataKey;
    nameAlignment: 'left' | 'center' | 'right';
    axisLabel: {
      rotate: number;
      formatter: IXAxisLabelFormatter;
      overflow: IAxisLabelOverflow;
    };
  };
  heat_block: {
    min: number;
    max: number;
    name: string;
    data_key: TDataKey;
    value_formatter: TNumbroFormat;
  };
  tooltip: {
    metrics: IEchartsTooltipMetric[];
  };
}

export const DEFAULT_CONFIG: IHeatmapConf = {
  x_axis: {
    name: '',
    data_key: '',
    axisLabel: {
      rotate: 0,
      overflow: DEFAULT_AXIS_LABEL_OVERFLOW,
      formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
    },
  },
  y_axis: {
    name: 'Y Axis',
    data_key: '',
    nameAlignment: 'center',
    axisLabel: {
      rotate: 0,
      overflow: DEFAULT_AXIS_LABEL_OVERFLOW,
      formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
    },
  },
  heat_block: {
    min: 0,
    max: 1000,
    name: 'Value',
    data_key: '',
    value_formatter: defaultNumbroFormat,
  },
  tooltip: {
    metrics: [],
  },
};

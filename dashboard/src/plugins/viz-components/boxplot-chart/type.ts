import { defaultNumbroFormat, TNumbroFormat } from '~/panel/settings/common/numbro-format-selector';
import { DEFAULT_AXIS_LABEL_OVERFLOW, IAxisLabelOverflow } from '~/plugins/common-echarts-fields/axis-label-overflow';
import {
  DEFAULT_X_AXIS_LABEL_FORMATTER,
  IXAxisLabelFormatter,
} from '../cartesian/editors/x-axis/x-axis-label-formatter/types';
import { IEchartsTooltipMetric } from '~/plugins/common-echarts-fields/tooltip-metric';
import { AnyObject } from '~/types';

export interface IBoxplotReferenceLine {
  name: string;
  template: string;
  variable_key: string;
}

export interface IBoxplotChartConf {
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
    data_key: string;
    label_formatter: TNumbroFormat;
  };
  tooltip: {
    metrics: IEchartsTooltipMetric[];
  };
  color: string;
  reference_lines: IBoxplotReferenceLine[];
}

export const DEFAULT_CONFIG: IBoxplotChartConf = {
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
    data_key: 'value',
    label_formatter: defaultNumbroFormat,
  },
  tooltip: {
    metrics: [],
  },
  color: '#228be6',
  reference_lines: [],
};

export interface IBoxplotDataItem {
  name: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: Array<[string, number, AnyObject]>;
}

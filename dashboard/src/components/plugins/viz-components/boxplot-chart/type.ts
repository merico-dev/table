import { defaultNumbroFormat, TNumbroFormat } from '~/utils';
import {
  DEFAULT_AXIS_LABEL_OVERFLOW,
  IAxisLabelOverflow,
} from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import {
  DEFAULT_X_AXIS_LABEL_FORMATTER,
  IXAxisLabelFormatter,
} from '../cartesian/editors/x-axis/x-axis-label-formatter/types';
import { IEchartsTooltipMetric } from '~/components/plugins/common-echarts-fields/tooltip-metric';
import { AnyObject } from '~/types';

export interface IBoxplotReferenceLine {
  name: string;
  template: string;
  variable_key: string;
}

export type TLegendOrientation = 'horizontal' | 'vertical';

export type TBoxplotLegend = {
  show: boolean;
  top: string;
  right: string;
  bottom: string;
  left: string;
  orient: TLegendOrientation;
  type: 'scroll';
};

export interface IBoxplotChartConf {
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
    label_formatter: TNumbroFormat;
  };
  tooltip: {
    metrics: IEchartsTooltipMetric[];
  };
  color: string;
  reference_lines: IBoxplotReferenceLine[];
  legend: TBoxplotLegend;
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
  color: 'rgba(99, 152, 199, 0.10)',
  reference_lines: [],
  legend: {
    show: true,
    top: '10',
    right: '0',
    left: 'auto',
    bottom: 'auto',
    orient: 'vertical',
    type: 'scroll',
  },
};

export type TOutlierDataItem = [string, number, AnyObject];
export type TScatterDataItem = [string, number, AnyObject];

export interface IBoxplotDataItem {
  name: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

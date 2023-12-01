import { defaultNumberFormat, TNumberFormat } from '~/utils';
import {
  DEFAULT_AXIS_LABEL_OVERFLOW,
  IAxisLabelOverflow,
} from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { IEchartsTooltipMetric } from '~/components/plugins/common-echarts-fields/tooltip-metric';
import { AggregationType, DefaultAggregation } from '~/utils/aggregation';
import {
  DEFAULT_X_AXIS_LABEL_FORMATTER,
  IXAxisLabelFormatter,
} from '../cartesian/editors/x-axis/x-axis-label-formatter/types';

export interface IHorizontalBarChartReferenceLine {
  id: string;
  name: string;
  template: string;
  lineStyle: {
    type: 'solid' | 'dashed' | 'dotted';
    width: number;
    color: string;
  };
  xAxisIndex: string;
  orientation: 'horizontal' | 'vertical';
  variable_key: string;
  show_in_legend: boolean;
}

export interface IHorizontalBarChartSeriesItem {
  id: string;
  type: 'bar';
  name: string;
  stack: string;
  color?: string;
  barGap?: '0%' | '-100%';
  data_key: TDataKey;
  barWidth: string;
  xAxisIndex: string;
  barMinWidth: string;
  barMaxWidth: string;
  group_by_key: TDataKey;
  hide_in_legend: boolean;
  invisible: boolean;
  label_position?: string;
  aggregation_on_value?: AggregationType;
}

export interface IHorizontalBarChartXAxis {
  id: string;
  min: string;
  max: string;
  name: string;
  data_key: TDataKey;
  position: 'top' | 'bottom';
  label_formatter: TNumberFormat;
  show: boolean;
}

export interface IHorizontalBarChartConf {
  x_axes: IHorizontalBarChartXAxis[];
  y_axis: {
    name: string;
    data_key: TDataKey;
    axisLabel: {
      overflow: IAxisLabelOverflow;
      formatter: IXAxisLabelFormatter;
    };
    nameAlignment: 'left' | 'center' | 'right';
  };
  series: IHorizontalBarChartSeriesItem[];
  tooltip: {
    metrics: IEchartsTooltipMetric[];
  };
  reference_lines: IHorizontalBarChartReferenceLine[];
}

export const DEFAULT_CONFIG: IHorizontalBarChartConf = {
  x_axes: [
    {
      id: 'initial-x',
      min: '',
      max: '',
      name: 'X Axis',
      data_key: '',
      position: 'bottom',
      label_formatter: defaultNumberFormat,
      show: true,
    },
  ],
  y_axis: {
    name: 'Y Axis',
    data_key: '',
    axisLabel: {
      formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
      overflow: DEFAULT_AXIS_LABEL_OVERFLOW,
    },
    nameAlignment: 'center',
  },
  series: [],
  tooltip: {
    metrics: [],
  },
  reference_lines: [],
};

export function getNewXAxis(): IHorizontalBarChartXAxis {
  const id = new Date().getTime().toString();
  return {
    id,
    min: '',
    max: '',
    name: id,
    data_key: '',
    position: 'bottom',
    label_formatter: defaultNumberFormat,
    show: true,
  };
}

export function getNewSeriesItem(): IHorizontalBarChartSeriesItem {
  const id = new Date().getTime().toString();
  return {
    id,
    type: 'bar',
    name: id,
    stack: '',
    color: '',
    barGap: '0%',
    data_key: '',
    barWidth: '',
    barMinWidth: '1',
    barMaxWidth: '10',
    group_by_key: '',
    hide_in_legend: false,
    invisible: false,
    label_position: 'right',
    aggregation_on_value: DefaultAggregation,
    xAxisIndex: '0',
  };
}

export function getNewReferenceLine(): IHorizontalBarChartReferenceLine {
  const id = new Date().getTime().toString();
  return {
    id,
    name: id,
    template: '',
    variable_key: '',
    orientation: 'horizontal',
    lineStyle: {
      type: 'dashed',
      width: 1,
      color: '#868E96',
    },
    show_in_legend: false,
    xAxisIndex: '0',
  };
}

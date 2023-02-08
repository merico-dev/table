import { defaultNumbroFormat, TNumbroFormat } from '~/panel/settings/common/numbro-format-selector';
import { DEFAULT_DATA_ZOOM_CONFIG, TEchartsDataZoomConfig } from './panel/echarts-zooming-field/types';
import { TScatterSize } from './panel/scatter-size-select/types';
import { DEFAULT_X_AXIS_LABEL_FORMATTER, IXAxisLabelFormatter } from './panel/x-axis/x-axis-label-formatter/types';
import { DEFAULT_X_AXIS_LABEL_OVERFLOW, IXAxisLabelOverflow } from './panel/x-axis/x-axis-label-overflow/types';

export interface ICartesianChartSeriesItem {
  type: 'line' | 'bar' | 'scatter';
  name: string;
  display_name_on_line: boolean;
  showSymbol: boolean;
  symbolSize: TScatterSize;
  y_axis_data_key: string;
  yAxisIndex: number;
  label_position?: string;
  stack: string;
  color?: string;
  barWidth: string;
  barGap?: string;
  smooth: boolean;
  step: false | 'start' | 'middle' | 'end';
  group_by_key: string;
  lineStyle: {
    type: 'solid' | 'dashed' | 'dotted';
    width: number;
  };
  hide_in_legend: boolean;
}

export interface IYAxisConf {
  name: string;
  nameAlignment: 'left' | 'center' | 'right';
  position: 'left' | 'right';
  label_formatter: TNumbroFormat;
  min: string;
  max: string;
}

export interface IRegressionTransform {
  type: 'ecStat:regression';
  config: {
    method: 'linear' | 'exponential' | 'logarithmic' | 'polynomial';
    order: number;
    formulaOn: 'end';
  };
}

export interface IRegressionLineConf {
  type: 'line';
  yAxisIndex: number;
  color: string;
  lineStyle: {
    type: 'solid' | 'dashed' | 'dotted';
    width: number;
  };
}

export interface IRegressionConf {
  transform: IRegressionTransform;
  plot: IRegressionLineConf;
  name: string;
  y_axis_data_key: string;
}

export interface ICartesianReferenceLine {
  name: string;
  template: string;
  variable_key: string;
  orientation: 'horizontal' | 'vertical';
}

export interface ICartesianReferenceArea {
  name: string;
  color: string;
  type: 'rectangle';
  direction: 'horizontal';
  y_keys: {
    upper: string;
    lower: string;
  };
}

export interface ICartesianChartConf {
  x_axis_data_key: string;
  x_axis_name: string;
  y_axes: IYAxisConf[];
  x_axis: {
    axisLabel: {
      rotate: number;
      formatter: IXAxisLabelFormatter;
      overflow: IXAxisLabelOverflow;
    };
  };
  series: ICartesianChartSeriesItem[];
  regressions: IRegressionConf[];
  stats: {
    templates: {
      top: string;
      bottom: string;
    };
  };
  reference_lines: ICartesianReferenceLine[];
  reference_areas: ICartesianReferenceArea[];
  dataZoom: TEchartsDataZoomConfig;
}

export const DEFAULT_CONFIG: ICartesianChartConf = {
  regressions: [],
  series: [],
  stats: { templates: { bottom: '', top: '' } },
  x_axis: {
    axisLabel: {
      rotate: 0,
      formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
      overflow: DEFAULT_X_AXIS_LABEL_OVERFLOW,
    },
  },
  x_axis_data_key: '',
  x_axis_name: '',
  y_axes: [
    {
      name: 'Y Axis',
      position: 'left',
      nameAlignment: 'center',
      label_formatter: defaultNumbroFormat,
      min: '',
      max: '',
    },
  ],
  reference_lines: [],
  reference_areas: [],
  dataZoom: DEFAULT_DATA_ZOOM_CONFIG,
};

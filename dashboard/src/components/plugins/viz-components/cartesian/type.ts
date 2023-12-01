import { defaultNumberFormat, TNumberFormat } from '~/utils';
import {
  DEFAULT_AXIS_LABEL_OVERFLOW,
  IAxisLabelOverflow,
} from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { IRegressionLineConf, IRegressionTransform } from '~/components/plugins/common-echarts-fields/regression-line';
import { AggregationType } from '~/utils';
import { DEFAULT_DATA_ZOOM_CONFIG, TEchartsDataZoomConfig } from './editors/echarts-zooming-field/types';
import { TScatterSize } from './editors/scatter-size-select/types';
import { DEFAULT_X_AXIS_LABEL_FORMATTER, IXAxisLabelFormatter } from './editors/x-axis/x-axis-label-formatter/types';

export interface ICartesianChartSeriesItem {
  type: 'line' | 'bar' | 'scatter';
  name: string;
  display_name_on_line: boolean;
  showSymbol: boolean;
  symbolSize: TScatterSize;
  y_axis_data_key: TDataKey;
  yAxisIndex: number;
  label_position?: string;
  stack: string;
  color?: string;
  barMinWidth: string;
  barWidth: string;
  barMaxWidth: string;
  barGap?: string;
  smooth: boolean;
  step: false | 'start' | 'middle' | 'end';
  group_by_key: string;
  aggregation_on_value?: AggregationType;
  lineStyle: {
    type: 'solid' | 'dashed' | 'dotted';
    width: number;
  };
  hide_in_legend: boolean;
}

export interface IYAxisConf {
  min: string;
  max: string;
  name: string;
  show: boolean;
  position: 'left' | 'right';
  nameAlignment: 'left' | 'center' | 'right';
  label_formatter: TNumberFormat;
}

export interface IRegressionConf {
  transform: IRegressionTransform;
  plot: IRegressionLineConf;
  name: string;
  y_axis_data_key: TDataKey;
  group_by_key: TDataKey;
}

export interface ICartesianReferenceLine {
  name: string;
  template: string;
  variable_key: string;
  orientation: 'horizontal' | 'vertical';
  yAxisIndex: number;
  lineStyle: {
    type: 'solid' | 'dashed' | 'dotted';
    width: number;
    color: string;
  };
  show_in_legend: boolean;
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
    type: 'value' | 'category' | 'time' | 'log';
    axisLabel: {
      rotate: number;
      formatter: IXAxisLabelFormatter;
      overflow: IAxisLabelOverflow;
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
    type: 'category',
    axisLabel: {
      rotate: 0,
      formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
      overflow: DEFAULT_AXIS_LABEL_OVERFLOW,
    },
  },
  x_axis_data_key: '',
  x_axis_name: '',
  y_axes: [
    {
      min: '',
      max: '',
      name: 'Y Axis',
      show: true,
      position: 'left',
      nameAlignment: 'center',
      label_formatter: defaultNumberFormat,
    },
  ],
  reference_lines: [],
  reference_areas: [],
  dataZoom: DEFAULT_DATA_ZOOM_CONFIG,
};

import {
  getDefaultAxisLabelOverflow,
  IAxisLabelOverflow,
} from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { IRegressionLineConf, IRegressionTransform } from '~/components/plugins/common-echarts-fields/regression-line';
import { AggregationType, defaultNumberFormat, TNumberFormat } from '~/utils';
import { IEchartsLabelPosition } from '../../common-echarts-fields/label-position';
import { IEChartsLineType } from '../../common-echarts-fields/line-type';
import { EChartsNameTextAlign } from '../../common-echarts-fields/name-text-align';
import { ChartingOrientation } from '../../common-echarts-fields/orientation';
import { SymbolSize } from '../../common-echarts-fields/symbol-size';
import { IEchartsTooltipMetric } from '../../common-echarts-fields/tooltip-metric';
import {
  getDefaultXAxisLabelFormatter,
  IXAxisLabelFormatter,
} from '../../common-echarts-fields/x-axis-label-formatter';
import { EChartsYAxisPosition } from '../../common-echarts-fields/y-axis-position';
import { DEFAULT_DATA_ZOOM_CONFIG, TEchartsDataZoomConfig } from './editors/echarts-zooming-field/types';
import { EchartsLineAreaStyle } from '../../common-echarts-fields/line-area-style';
import { SeriesOrder } from '../../common-echarts-fields/series-order';

export interface ICartesianChartSeriesItem {
  type: 'line' | 'bar' | 'scatter';
  name: string;
  display_name_on_line: boolean;
  showSymbol: boolean;
  symbolSize: SymbolSize;
  y_axis_data_key: TDataKey;
  yAxisIndex: number;
  label_position?: IEchartsLabelPosition;
  stack: string;
  color?: string;
  barMinWidth: string;
  barWidth: string;
  barMaxWidth: string;
  barGap?: string;
  smooth: boolean;
  step: false | 'start' | 'middle' | 'end';
  group_by_key: string;
  order_in_group: SeriesOrder;
  aggregation_on_value?: AggregationType;
  lineStyle: {
    type: IEChartsLineType;
    width: number;
  };
  hide_in_legend: boolean;
  areaStyle: EchartsLineAreaStyle;
}

export interface IYAxisConf {
  min: string;
  max: string;
  name: string;
  show: boolean;
  position: EChartsYAxisPosition;
  nameAlignment: EChartsNameTextAlign;
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
  orientation: ChartingOrientation;
  yAxisIndex: number;
  lineStyle: {
    type: IEChartsLineType;
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
    top: string;
    bottom: string;
  };
  tooltip: {
    metrics: IEchartsTooltipMetric[];
  };
  reference_lines: ICartesianReferenceLine[];
  reference_areas: ICartesianReferenceArea[];
  dataZoom: TEchartsDataZoomConfig;
}

export const DEFAULT_CONFIG: ICartesianChartConf = {
  regressions: [],
  series: [],
  stats: { bottom: '', top: '' },
  x_axis: {
    type: 'category',
    axisLabel: {
      rotate: 0,
      formatter: getDefaultXAxisLabelFormatter(),
      overflow: getDefaultAxisLabelOverflow(),
    },
  },
  tooltip: { metrics: [] },
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

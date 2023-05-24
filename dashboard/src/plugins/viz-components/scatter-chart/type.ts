import { defaultNumbroFormat } from '~/panel/settings/common/numbro-format-selector';
import { DEFAULT_DATA_ZOOM_CONFIG, TEchartsDataZoomConfig } from '../cartesian/editors/echarts-zooming-field/types';
import { DEFAULT_SERIES_COLOR, TSeriesColor } from './editors/scatter/series-color-select/types';

import { DEFAULT_AXIS_LABEL_OVERFLOW, IEchartsOverflow } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { IEchartsReferenceArea } from '~/plugins/common-echarts-fields/reference-area/types';
import { IEchartsTooltipMetric } from '~/plugins/common-echarts-fields/tooltip-metric';
import { ICartesianReferenceLine, IYAxisConf } from '../cartesian/type';
import { TScatterSize } from './editors/scatter/scatter-size-select/types';
import { DEFAULT_X_AXIS_LABEL_FORMATTER, IXAxisLabelFormatter } from './editors/x-axis/x-axis-label-formatter/types';

export interface IScatterLabelOverflow {
  label: IEchartsOverflow;
  tooltip: IEchartsOverflow;
}

export interface IScatterChartConf {
  x_axis: {
    data_key: string;
    name: string;
    axisLabel: {
      rotate: number;
      formatter: IXAxisLabelFormatter;
    };
  };
  y_axes: IYAxisConf[];
  scatter: {
    y_data_key: string;
    name_data_key: string;
    symbolSize: TScatterSize;
    label_position: string;
    color: TSeriesColor;
    label_overflow: IScatterLabelOverflow;
  };
  stats: {
    templates: {
      top: string;
      bottom: string;
    };
  };
  tooltip: {
    trigger: 'item' | 'axis' | 'none';
    metrics: IEchartsTooltipMetric[];
  };
  reference_lines: ICartesianReferenceLine[];
  reference_areas: IEchartsReferenceArea[];
  dataZoom: TEchartsDataZoomConfig;
}

export const DEFAULT_SCATTER_CHART_LABEL_OVERFLOW = {
  label: DEFAULT_AXIS_LABEL_OVERFLOW.on_axis,
  tooltip: DEFAULT_AXIS_LABEL_OVERFLOW.in_tooltip,
};

export const DEFAULT_CONFIG: IScatterChartConf = {
  scatter: {
    y_data_key: '',
    name_data_key: '',
    symbolSize: {
      type: 'static',
      size: 10,
    },
    color: DEFAULT_SERIES_COLOR.static,
    label_position: 'right',
    label_overflow: DEFAULT_SCATTER_CHART_LABEL_OVERFLOW,
  },
  stats: {
    templates: {
      top: '',
      bottom: '',
    },
  },
  x_axis: {
    name: '',
    data_key: '',
    axisLabel: {
      rotate: 0,
      formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
    },
  },
  y_axes: [
    {
      name: 'Y Axis',
      position: 'left',
      nameAlignment: 'center',
      label_formatter: defaultNumbroFormat,
      min: '',
      max: '',
      show: true,
    },
  ],
  tooltip: {
    trigger: 'item',
    metrics: [],
  },
  reference_lines: [],
  reference_areas: [],
  dataZoom: DEFAULT_DATA_ZOOM_CONFIG,
};

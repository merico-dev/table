import { defaultNumberFormat } from '~/utils';
import { DEFAULT_DATA_ZOOM_CONFIG, TEchartsDataZoomConfig } from '../cartesian/editors/echarts-zooming-field/types';
import { DEFAULT_SERIES_COLOR, TSeriesColor } from './editors/scatter/series-color-select/types';

import {
  IAxisLabelOverflow,
  IEchartsOverflow,
  getDefaultAxisLabelOverflow,
} from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { IEchartsReferenceArea } from '~/components/plugins/common-echarts-fields/reference-area/types';
import { IEchartsTooltipMetric } from '~/components/plugins/common-echarts-fields/tooltip-metric';
import { SymbolSize } from '../../common-echarts-fields/symbol-size';
import { ICartesianReferenceLine, IYAxisConf } from '../cartesian/type';
import { IXAxisLabelFormatter, getDefaultXAxisLabelFormatter } from './editors/x-axis/x-axis-label-formatter/types';
import { IEchartsLabelPosition } from '../../common-echarts-fields/label-position';

export interface IScatterLabelOverflow {
  label: IEchartsOverflow;
  tooltip: IEchartsOverflow;
}

export interface IScatterChartConf {
  x_axis: {
    data_key: TDataKey;
    name: string;
    axisLabel: {
      rotate: number;
      formatter: IXAxisLabelFormatter;
      overflow: IAxisLabelOverflow;
    };
  };
  y_axes: IYAxisConf[];
  scatter: {
    y_data_key: TDataKey;
    name_data_key: TDataKey;
    symbolSize: SymbolSize;
    label_position: IEchartsLabelPosition;
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

export function getDefaultScatterLabelOverfow() {
  const { on_axis, in_tooltip } = getDefaultAxisLabelOverflow();
  return {
    label: on_axis,
    tooltip: in_tooltip,
  };
}

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
    label_overflow: getDefaultScatterLabelOverfow(),
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
      formatter: getDefaultXAxisLabelFormatter(),
      overflow: getDefaultAxisLabelOverflow(),
    },
  },
  y_axes: [
    {
      name: 'Y Axis',
      position: 'left',
      nameAlignment: 'center',
      label_formatter: defaultNumberFormat,
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

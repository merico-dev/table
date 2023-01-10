import { defaultNumbroFormat } from '~/panel/settings/common/numbro-format-selector';
import { DEFAULT_DATA_ZOOM_CONFIG, TEchartsDataZoomConfig } from '../cartesian/panel/echarts-zooming-field/types';

import { ICartesianReferenceArea, ICartesianReferenceLine, IYAxisConf } from '../cartesian/type';
import { TScatterSize } from './editors/scatter/scatter-size-select/types';
import { DEFAULT_X_AXIS_LABEL_FORMATTER, IXAxisLabelFormatter } from './editors/x-axis/x-axis-label-formatter/types';

export interface IScatterTooltipMetric {
  id: string;
  data_key: string;
  name: string;
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
    color: string;
  };
  stats: {
    templates: {
      top: string;
      bottom: string;
    };
  };
  tooltip: {
    metrics: IScatterTooltipMetric[];
  };
  reference_lines: ICartesianReferenceLine[];
  reference_areas: ICartesianReferenceArea[];
  dataZoom: TEchartsDataZoomConfig;
}

export const DEFAULT_CONFIG: IScatterChartConf = {
  scatter: {
    y_data_key: '',
    name_data_key: '',
    symbolSize: {
      type: 'static',
      size: 10,
    },
    color: '#000000',
    label_position: 'right',
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
    },
  ],
  tooltip: {
    metrics: [],
  },
  reference_lines: [],
  reference_areas: [],
  dataZoom: DEFAULT_DATA_ZOOM_CONFIG,
};

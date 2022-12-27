import { defaultNumbroFormat } from '~/panel/settings/common/numbro-format-selector';

import { ICartesianReferenceArea, ICartesianReferenceLine, IYAxisConf } from '../cartesian/type';
import { TScatterSize } from './editors/scatter/scatter-size-select/types';
import { DEFAULT_X_AXIS_LABEL_FORMATTER, IXAxisLabelFormatter } from './editors/x-axis/x-axis-label-formatter/types';

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
  };
  stats: {
    templates: {
      top: string;
      bottom: string;
    };
  };
  reference_lines: ICartesianReferenceLine[];
  reference_areas: ICartesianReferenceArea[];
}

export const DEFAULT_CONFIG: IScatterChartConf = {
  scatter: {
    y_data_key: '',
    name_data_key: '',
    symbolSize: {
      type: 'static',
      size: 10,
    },
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
  reference_lines: [],
  reference_areas: [],
};

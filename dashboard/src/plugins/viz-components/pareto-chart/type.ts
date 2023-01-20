import { defaultNumbroFormat, TNumbroFormat } from '~/panel/settings/common/numbro-format-selector';
import { DEFAULT_DATA_ZOOM_CONFIG, TEchartsDataZoomConfig } from '../cartesian/panel/echarts-zooming-field/types';
import {
  DEFAULT_X_AXIS_LABEL_FORMATTER,
  IXAxisLabelFormatter,
} from '../cartesian/panel/x-axis/x-axis-label-formatter/types';
import {
  DEFAULT_X_AXIS_LABEL_OVERFLOW,
  IXAxisLabelOverflow,
} from '../cartesian/panel/x-axis/x-axis-label-overflow/types';

export const DEFAULT_PARETO_MARK_LINE = {
  label_template: '${percentage.x} of ${x_axis.name} causes ${percentage.y} of ${bar.name}',
  color: 'rgba(0,0,0,0.3)',
};

export interface IParetoChartConf {
  x_axis: {
    name: string;
    data_key: string;
    axisLabel: {
      rotate: number;
      formatter: IXAxisLabelFormatter;
      overflow: IXAxisLabelOverflow;
    };
  };
  data_key: string;
  bar: {
    name: string;
    color: string;
    label_formatter: TNumbroFormat;
  };
  line: {
    name: string;
    color: string;
  };
  dataZoom: TEchartsDataZoomConfig;
  markLine: {
    label_template: string;
    color: string;
  };
}

export const DEFAULT_CONFIG: IParetoChartConf = {
  x_axis: {
    name: 'X Axis',
    data_key: '',
    axisLabel: {
      rotate: 0,
      formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
      overflow: DEFAULT_X_AXIS_LABEL_OVERFLOW,
    },
  },
  data_key: 'value',
  bar: {
    name: 'Value',
    color: '#228be6',
    label_formatter: defaultNumbroFormat,
  },
  line: {
    name: 'Value',
    color: 'red',
  },
  dataZoom: DEFAULT_DATA_ZOOM_CONFIG,
  markLine: DEFAULT_PARETO_MARK_LINE,
};

import { defaultNumberFormat, TNumberFormat } from '~/utils';
import {
  DEFAULT_AXIS_LABEL_OVERFLOW,
  IAxisLabelOverflow,
} from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { DEFAULT_DATA_ZOOM_CONFIG, TEchartsDataZoomConfig } from '../cartesian/editors/echarts-zooming-field/types';
import {
  DEFAULT_X_AXIS_LABEL_FORMATTER,
  IXAxisLabelFormatter,
} from '../cartesian/editors/x-axis/x-axis-label-formatter/types';

export const DEFAULT_PARETO_MARK_LINE = {
  label_template: '${percentage.x} of ${x_axis.name} causes ${percentage.y} of ${bar.name}',
  color: '#789AB4',
};

export interface IParetoChartConf {
  x_axis: {
    name: string;
    data_key: string;
    axisLabel: {
      rotate: number;
      formatter: IXAxisLabelFormatter;
      overflow: IAxisLabelOverflow;
    };
  };
  data_key: string;
  bar: {
    name: string;
    nameAlignment: 'left' | 'center' | 'right';
    color: string;
    label_formatter: TNumberFormat;
  };
  line: {
    name: string;
    nameAlignment: 'left' | 'center' | 'right';
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
      overflow: DEFAULT_AXIS_LABEL_OVERFLOW,
    },
  },
  data_key: 'value',
  bar: {
    name: 'Value',
    nameAlignment: 'left',
    color: '#228be6',
    label_formatter: defaultNumberFormat,
  },
  line: {
    name: 'Value',
    nameAlignment: 'right',
    color: 'red',
  },
  dataZoom: DEFAULT_DATA_ZOOM_CONFIG,
  markLine: DEFAULT_PARETO_MARK_LINE,
};

import {
  getDefaultAxisLabelOverflow,
  IAxisLabelOverflow,
} from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { IEchartsTooltipMetric } from '~/components/plugins/common-echarts-fields/tooltip-metric';
import { AnyObject } from '~/types';
import { defaultNumberFormat, TNumberFormat } from '~/utils';
import {
  DEFAULT_X_AXIS_LABEL_FORMATTER,
  IXAxisLabelFormatter,
} from '../cartesian/editors/x-axis/x-axis-label-formatter/types';
import {
  DEFAULT_DATA_ZOOM_CONFIG,
  getDefaultDataZoomConfig,
  TEchartsDataZoomConfig,
} from '../cartesian/editors/echarts-zooming-field/types';

export interface IBoxplotReferenceLine {
  name: string;
  template: string;
  variable_key: string;
}

export type TLegendOrientation = 'horizontal' | 'vertical';

export type TBoxplotLegend = {
  show: boolean;
  top: string;
  right: string;
  bottom: string;
  left: string;
  orient: TLegendOrientation;
  type: 'scroll';
};

export interface IBoxplotChartConf {
  x_axis: {
    name: string;
    data_key: TDataKey;
    axisLabel: {
      rotate: number;
      formatter: IXAxisLabelFormatter;
      overflow: IAxisLabelOverflow;
    };
  };
  y_axis: {
    name: string;
    data_key: TDataKey;
    label_formatter: TNumberFormat;
  };
  tooltip: {
    metrics: IEchartsTooltipMetric[];
  };
  color: string;
  reference_lines: IBoxplotReferenceLine[];
  legend: TBoxplotLegend;
  dataZoom: TEchartsDataZoomConfig;
}

export const DEFAULT_CONFIG: IBoxplotChartConf = {
  x_axis: {
    name: 'X Axis',
    data_key: '',
    axisLabel: {
      rotate: 0,
      formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
      overflow: getDefaultAxisLabelOverflow(),
    },
  },
  y_axis: {
    name: 'Y Axis',
    data_key: 'value',
    label_formatter: defaultNumberFormat,
  },
  tooltip: {
    metrics: [],
  },
  color: 'rgba(99, 152, 199, 0.10)',
  reference_lines: [],
  legend: {
    show: true,
    top: '10',
    right: '0',
    left: 'auto',
    bottom: 'auto',
    orient: 'vertical',
    type: 'scroll',
  },
  dataZoom: getDefaultDataZoomConfig(),
};

export type TOutlierDataItem = [string, number, AnyObject];
export type TScatterDataItem = [string, number, AnyObject];

export interface IBoxplotDataItem {
  name: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

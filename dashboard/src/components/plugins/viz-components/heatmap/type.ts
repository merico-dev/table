import {
  getDefaultAxisLabelOverflow,
  IAxisLabelOverflow,
} from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { TNumberOrDynamic } from '~/components/plugins/common-echarts-fields/number-or-dynamic-value/types';
import { IEchartsTooltipMetric } from '~/components/plugins/common-echarts-fields/tooltip-metric';
import { defaultNumberFormat, TNumberFormat } from '~/utils';
import { EChartsNameTextAlign } from '../../common-echarts-fields/name-text-align';
import {
  DEFAULT_X_AXIS_LABEL_FORMATTER,
  IXAxisLabelFormatter,
} from '../../common-echarts-fields/x-axis-label-formatter';

export interface IHeatmapConf {
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
    nameAlignment: EChartsNameTextAlign;
    axisLabel: {
      rotate: number;
      formatter: IXAxisLabelFormatter;
      overflow: IAxisLabelOverflow;
    };
  };
  heat_block: {
    min: TNumberOrDynamic;
    max: TNumberOrDynamic;
    name: string;
    data_key: TDataKey;
    value_formatter: TNumberFormat;
    label: {
      show: boolean;
      fontSize: number;
    };
  };
  tooltip: {
    metrics: IEchartsTooltipMetric[];
  };
}

export const DEFAULT_CONFIG: IHeatmapConf = {
  x_axis: {
    name: '',
    data_key: '',
    axisLabel: {
      rotate: 0,
      overflow: getDefaultAxisLabelOverflow(),
      formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
    },
  },
  y_axis: {
    name: 'Y Axis',
    data_key: '',
    nameAlignment: 'center',
    axisLabel: {
      rotate: 0,
      overflow: getDefaultAxisLabelOverflow(),
      formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
    },
  },
  heat_block: {
    min: {
      type: 'static',
      value: 0,
    },
    max: {
      type: 'static',
      value: 100,
    },
    name: 'Value',
    data_key: '',
    value_formatter: defaultNumberFormat,
    label: {
      show: false,
      fontSize: 10,
    },
  },
  tooltip: {
    metrics: [],
  },
};

import {
  getDefaultAxisLabelOverflow,
  IAxisLabelOverflow,
} from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { IEchartsTooltipMetric } from '~/components/plugins/common-echarts-fields/tooltip-metric';
import { defaultNumberFormat, TNumberFormat } from '~/utils';
import { EChartsNameTextAlign } from '../../common-echarts-fields/name-text-align';
import { getDefaultVisualMap, VisualMap } from '../../common-echarts-fields/visual-map';
import {
  getDefaultXAxisLabelFormatter,
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
  visualMap: VisualMap;
}

export const DEFAULT_CONFIG: IHeatmapConf = {
  x_axis: {
    name: '',
    data_key: '',
    axisLabel: {
      rotate: 0,
      overflow: getDefaultAxisLabelOverflow(),
      formatter: getDefaultXAxisLabelFormatter(),
    },
  },
  y_axis: {
    name: 'Y Axis',
    data_key: '',
    nameAlignment: 'center',
    axisLabel: {
      rotate: 0,
      overflow: getDefaultAxisLabelOverflow(),
      formatter: getDefaultXAxisLabelFormatter(),
    },
  },
  heat_block: {
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
  visualMap: getDefaultVisualMap(),
};

import { defaultNumbroFormat, TNumbroFormat } from '~/panel/settings/common/numbro-format-selector';
import { IEchartsTooltipMetric } from '~/plugins/common-echarts-fields/tooltip-metric';

export interface ICalendarHeatmapConf {
  calendar: {
    data_key: string;
  };
  heat_block: {
    min: number;
    max: number;
    name: string;
    data_key: '';
    value_formatter: TNumbroFormat;
  };
  tooltip: {
    metrics: IEchartsTooltipMetric[];
  };
}

export const DEFAULT_CONFIG: ICalendarHeatmapConf = {
  calendar: {
    data_key: '',
  },
  heat_block: {
    min: 0,
    max: 1000,
    name: 'Value',
    data_key: '',
    value_formatter: defaultNumbroFormat,
  },
  tooltip: {
    metrics: [],
  },
};

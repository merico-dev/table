import { defaultNumberFormat, TNumberFormat } from '~/utils';
import { TNumberOrDynamic } from '~/components/plugins/common-echarts-fields/number-or-dynamic-value';
import { IEchartsTooltipMetric } from '~/components/plugins/common-echarts-fields/tooltip-metric';

export interface ICalendarHeatmapConf {
  calendar: {
    data_key: TDataKey;
    locale: 'ZH' | 'EN';
  };
  heat_block: {
    min: TNumberOrDynamic;
    max: TNumberOrDynamic;
    name: string;
    data_key: TDataKey;
    value_formatter: TNumberFormat;
  };
  tooltip: {
    metrics: IEchartsTooltipMetric[];
  };
}

export const DEFAULT_CONFIG: ICalendarHeatmapConf = {
  calendar: {
    data_key: '',
    locale: 'EN',
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
  },
  tooltip: {
    metrics: [],
  },
};

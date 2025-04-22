import { IEchartsTooltipMetric } from '~/components/plugins/common-echarts-fields/tooltip-metric';
import { defaultNumberFormat, TNumberFormat } from '~/utils';
import { getDefaultVisualMap, VisualMap } from '../../common-echarts-fields/visual-map';
import { getDefaultSeriesUnit, SeriesUnitType } from '../../common-echarts-fields/series-unit';

export interface ICalendarHeatmapConf {
  calendar: {
    data_key: TDataKey;
    locale: 'ZH' | 'EN';
  };
  heat_block: {
    name: string;
    data_key: TDataKey;
    unit: SeriesUnitType;
    value_formatter: TNumberFormat;
  };
  tooltip: {
    metrics: IEchartsTooltipMetric[];
  };
  visualMap: VisualMap;
}

export const DEFAULT_CONFIG: ICalendarHeatmapConf = {
  calendar: {
    data_key: '',
    locale: 'EN',
  },
  heat_block: {
    name: 'Value',
    data_key: '',
    unit: getDefaultSeriesUnit(),
    value_formatter: defaultNumberFormat,
  },
  tooltip: {
    metrics: [],
  },
  visualMap: getDefaultVisualMap(),
};

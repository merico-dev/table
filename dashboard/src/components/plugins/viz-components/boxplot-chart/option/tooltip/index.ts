import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { IBoxplotChartConf, IBoxplotDataItem, TOutlierDataItem, TScatterDataItem } from '../../type';
import { getBoxplotTooltipContent } from './boxplot';
import { getOutlierTooltipContent } from './outlier';
import { getScatterTooltipContent } from './scatter';
import { SeriesNames } from '../type';

type TTooltipFormatterParams = {
  seriesName: string;
  value: IBoxplotDataItem | TOutlierDataItem | TScatterDataItem;
};

const getFormatter = (config: IBoxplotChartConf, seriesNames: SeriesNames) => (params: TTooltipFormatterParams) => {
  const { seriesName, value } = params;

  switch (seriesName) {
    case seriesNames.Box:
      return getBoxplotTooltipContent(config, value as IBoxplotDataItem);
    case seriesNames.Outlier:
      return getOutlierTooltipContent(config, value as TOutlierDataItem);
    case seriesNames.Scatter:
      return getScatterTooltipContent(config, value as TScatterDataItem);
  }
};

export function getTooltip({ config, seriesNames }: { config: IBoxplotChartConf; seriesNames: SeriesNames }) {
  return defaultEchartsOptions.getTooltip({
    trigger: 'item',
    formatter: getFormatter(config, seriesNames),
  });
}

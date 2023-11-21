import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { IBoxplotChartConf, IBoxplotDataItem, TOutlierDataItem, TScatterDataItem } from '../../type';
import { getBoxplotTooltipContent } from './boxplot';
import { getOutlierTooltipContent } from './outlier';
import { getScatterTooltipContent } from './scatter';

type TTooltipFormatterParams =
  | {
      seriesName: 'Scatter';
      value: TScatterDataItem;
    }
  | {
      seriesName: 'Outlier';
      value: TOutlierDataItem;
    }
  | {
      seriesName: 'Box';
      value: IBoxplotDataItem;
    };

const getFormatter = (config: IBoxplotChartConf) => (params: TTooltipFormatterParams) => {
  const { seriesName, value } = params;

  switch (seriesName) {
    case 'Box':
      return getBoxplotTooltipContent(config, value);
    case 'Outlier':
      return getOutlierTooltipContent(config, value);
    case 'Scatter':
      return getScatterTooltipContent(config, value);
  }
};

export function getTooltip({ config }: { config: IBoxplotChartConf }) {
  return defaultEchartsOptions.getTooltip({
    trigger: 'item',
    formatter: getFormatter(config),
  });
}

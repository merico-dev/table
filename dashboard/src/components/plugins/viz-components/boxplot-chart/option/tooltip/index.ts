import { IBoxplotChartConf, IBoxplotDataItem, TOutlierDataItem, TScatterDataItem } from '../../type';
import { getBoxplotTooltipContent } from './boxplot';
import { getOutlierTooltipContent } from './outlier';
import { getScatterTooltipContent } from './scatter';

type TTooltipFormatterParams =
  | {
      seriesName: 'Custom Scatter';
      value: TScatterDataItem;
    }
  | {
      seriesName: 'Custom Outliers';
      value: TOutlierDataItem;
    }
  | {
      seriesName: 'Custom Box';
      value: IBoxplotDataItem;
    };

const getFormatter = (config: IBoxplotChartConf) => (params: TTooltipFormatterParams) => {
  const { seriesName, value } = params;

  switch (seriesName) {
    case 'Custom Box':
      return getBoxplotTooltipContent(config, value);
    case 'Custom Outliers':
      return getOutlierTooltipContent(config, value);
    case 'Custom Scatter':
      return getScatterTooltipContent(config, value);
  }
};

export function getTooltip({ config }: { config: IBoxplotChartConf }) {
  return {
    trigger: 'item',
    confine: true,
    formatter: getFormatter(config),
  };
}

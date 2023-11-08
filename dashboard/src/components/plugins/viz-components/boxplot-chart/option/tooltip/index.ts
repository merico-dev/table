import { IBoxplotChartConf, IBoxplotDataItem, TOutlierDataItem } from '../../type';
import { getBoxplotTooltipContent } from './boxplot';
import { getScatterTooltipContent } from './scatter';

type TTooltipFormatterParams =
  | {
      componentSubType: 'scatter';
      value: TOutlierDataItem;
    }
  | {
      componentSubType: 'boxplot';
      value: IBoxplotDataItem;
    };

const getFormatter = (config: IBoxplotChartConf) => (params: TTooltipFormatterParams) => {
  const { componentSubType, value } = params;

  console.log(componentSubType, value, params);
  if (componentSubType === 'scatter') {
    return getScatterTooltipContent(config, value);
  }
  return getBoxplotTooltipContent(config, value);
};

export function getTooltip({ config }: { config: IBoxplotChartConf }) {
  return {
    trigger: 'item',
    confine: true,
    formatter: getFormatter(config),
  };
}

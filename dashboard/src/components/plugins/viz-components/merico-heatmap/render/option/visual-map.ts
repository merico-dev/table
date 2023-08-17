import { getNumberOrDynamicValue } from '~/components/plugins/common-echarts-fields/number-or-dynamic-value';
import { TMericoHeatmapConf } from '../../type';

export function getVisualMap(conf: TMericoHeatmapConf, variableValueMap: Record<string, string | number>) {
  const min = getNumberOrDynamicValue(conf.heat_block.min, variableValueMap);
  const max = getNumberOrDynamicValue(conf.heat_block.max, variableValueMap);
  return {
    min,
    max,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    top: 0,
    itemWidth: 15,
  };
}

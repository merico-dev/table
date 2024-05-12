import { getNumberOrDynamicValue } from '~/components/plugins/common-echarts-fields/number-or-dynamic-value';
import { IHeatmapConf } from '../type';

export function getVisualMap(conf: IHeatmapConf, variableValueMap: Record<string, string | number>) {
  const { visualMap } = conf;
  const min = getNumberOrDynamicValue(visualMap.min, variableValueMap);
  const max = getNumberOrDynamicValue(visualMap.max, variableValueMap);
  return {
    ...visualMap,
    min,
    max,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    top: 0,
    itemWidth: 15,
  };
}

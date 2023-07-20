import { getNumberOrDynamicValue } from '~/components/plugins/common-echarts-fields/number-or-dynamic-value';
import { ICalendarHeatmapConf } from '../type';

export function getVisualMap(
  conf: ICalendarHeatmapConf,
  oneYearMode: boolean,
  variableValueMap: Record<string, string | number>,
) {
  const min = getNumberOrDynamicValue(conf.heat_block.min, variableValueMap);
  const max = getNumberOrDynamicValue(conf.heat_block.max, variableValueMap);
  return {
    min,
    max,
    calculable: true,
    orient: 'horizontal',
    left: oneYearMode ? 'center' : 5,
    top: 0,
    itemWidth: 15,
  };
}

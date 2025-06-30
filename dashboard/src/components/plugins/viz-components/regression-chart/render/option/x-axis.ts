import { getLabelOverflowOptionOnAxis } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { IRegressionChartConf } from '../../type';
import { ParsedDataKey } from '~/utils';

export function getXAxis(conf: IRegressionChartConf, x: ParsedDataKey) {
  const { overflow, format, formatter, ...axisLabel } = conf.x_axis.axisLabel;
  const overflowOption = getLabelOverflowOptionOnAxis(overflow.on_axis);
  return defaultEchartsOptions.getXAxis({
    type: 'value',
    name: x.columnKey,
    nameLocation: 'middle',
    nameGap: 25,
    axisLabel: {
      ...axisLabel,
      ...overflowOption,
    },
  });
}

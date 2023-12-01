import { getLabelOverflowOptionOnAxis } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { getEchartsXAxisLabel } from '~/components/plugins/common-echarts-fields/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { formatNumber } from '~/utils';
import { IRegressionChartConf } from '../type';

export function getXAxis(conf: IRegressionChartConf) {
  const { overflow, format, formatter, ...axisLabel } = conf.x_axis.axisLabel;
  const overflowOption = getLabelOverflowOptionOnAxis(overflow.on_axis);
  return defaultEchartsOptions.getXAxis({
    type: 'value',
    name: conf.x_axis.name ?? '',
    nameLocation: 'middle',
    nameGap: 25,
    axisLabel: {
      ...axisLabel,
      ...overflowOption,
      formatter: (value: number, index: number) => {
        let v: string | number = value;
        try {
          v = formatNumber(value, format);
        } catch (err) {}
        return getEchartsXAxisLabel(formatter)(v, index);
      },
    },
  });
}

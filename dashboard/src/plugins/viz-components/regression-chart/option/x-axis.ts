import { getLabelOverflowOptionOnAxis } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { IRegressionChartConf } from '../type';
import { getEchartsXAxisLabel } from '~/plugins/common-echarts-fields/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import numbro from 'numbro';

export function getXAxis(conf: IRegressionChartConf) {
  const { overflow, format, formatter, ...axisLabel } = conf.x_axis.axisLabel;
  const overflowOption = getLabelOverflowOptionOnAxis(overflow.on_axis);
  return {
    type: 'value',
    name: conf.x_axis.name ?? '',
    nameLocation: 'middle',
    nameGap: 25,
    axisTick: {
      show: true,
      alignWithLabel: true,
    },
    axisLabel: {
      ...axisLabel,
      ...overflowOption,
      formatter: (value: number, index: number) => {
        let v: string | number = value;
        try {
          v = numbro(value).format(format);
        } catch (err) {}
        return getEchartsXAxisLabel(formatter)(v, index);
      },
    },
  };
}

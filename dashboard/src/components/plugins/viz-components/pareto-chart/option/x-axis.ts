import { getLabelOverflowOptionOnAxis } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { getEchartsXAxisLabel } from '../../cartesian/editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IParetoChartConf } from '../type';

export function getXAxis(conf: IParetoChartConf) {
  const { name, axisLabel } = conf.x_axis;
  const overflowOption = getLabelOverflowOptionOnAxis(axisLabel.overflow.on_axis);
  return [
    {
      type: 'category',
      name: name,
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        fontWeight: 'bold',
        align: 'right',
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: true,
        alignWithLabel: true,
      },
      axisLabel: {
        ...axisLabel,
        ...overflowOption,
        formatter: getEchartsXAxisLabel(axisLabel.formatter),
      },
    },
  ];
}

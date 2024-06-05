import { getLabelOverflowOptionOnAxis } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { IParetoChartConf } from '../type';
import { getEchartsXAxisLabel } from '~/components/plugins/common-echarts-fields/x-axis-label-formatter';

export function getXAxis(conf: IParetoChartConf) {
  const { name, axisLabel } = conf.x_axis;
  const overflowOption = getLabelOverflowOptionOnAxis(axisLabel.overflow.on_axis);
  return [
    defaultEchartsOptions.getXAxis({
      type: 'category',
      id: 'main-x-axis',
      name: name,
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        align: 'right',
      },
      axisLabel: {
        ...axisLabel,
        ...overflowOption,
        formatter: getEchartsXAxisLabel(axisLabel.formatter),
      },
    }),
  ];
}

import { getLabelOverflowOptionOnAxis } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { getEchartsXAxisLabel } from '../editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { ICartesianChartConf } from '../type';

export function getXAxes(conf: ICartesianChartConf, xAxisData: $TSFixMe[]) {
  const { overflow, ...axisLabel } = conf.x_axis.axisLabel;
  const overflowOption = getLabelOverflowOptionOnAxis(overflow.on_axis);
  return [
    {
      data: xAxisData,
      name: conf.x_axis_name ?? '',
      id: 'main-x-axis',
      axisTick: {
        show: true,
        alignWithLabel: true,
      },
      type: conf.x_axis.type,
      axisLabel: {
        ...axisLabel,
        ...overflowOption,
        formatter: getEchartsXAxisLabel(axisLabel.formatter),
      },
    },
  ];
}

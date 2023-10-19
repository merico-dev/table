import { getLabelOverflowOptionOnAxis } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { getEchartsXAxisLabel } from '../../cartesian/editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IHorizontalBarChartConf } from '../type';

export function getYAxes(conf: IHorizontalBarChartConf, yAxisData: $TSFixMe[]) {
  const allNumbers = yAxisData.every((d) => !Number.isNaN(Number(d)));
  const { overflow, ...axisLabel } = conf.y_axis.axisLabel;
  const overflowOption = getLabelOverflowOptionOnAxis(overflow.on_axis);
  return [
    defaultEchartsOptions.getXAxis({
      data: yAxisData,
      name: conf.y_axis.name ?? '',
      // wait for https://github.com/apache/echarts/pull/16825
      nameLocation: 'end',
      nameTextStyle: {
        align: 'center',
      },
      id: 'main-y-axis',
      type: allNumbers ? 'value' : 'category',
      axisLabel: {
        ...axisLabel,
        ...overflowOption,
        formatter: getEchartsXAxisLabel(axisLabel.formatter),
      },
      z: 5,
    }),
  ];
}

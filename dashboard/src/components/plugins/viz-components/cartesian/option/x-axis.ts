import { getLabelOverflowOptionOnAxis } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { ICartesianChartConf } from '../type';
import { IAxisLabels } from './get-axis-labels';

export function getXAxes(conf: ICartesianChartConf, xAxisLabels: IAxisLabels) {
  const xAxisData = xAxisLabels.axisData;
  const { overflow, ...axisLabel } = conf.x_axis.axisLabel;
  const overflowOption = getLabelOverflowOptionOnAxis(overflow.on_axis);
  const xDataEmpty = xAxisData.length === 0;
  return [
    defaultEchartsOptions.getXAxis({
      data: xAxisData,
      name: conf.x_axis_name ?? '',
      nameGap: xDataEmpty ? 5 : undefined,
      id: 'main-x-axis',
      type: conf.x_axis.type,
      axisLabel: {
        ...axisLabel,
        ...overflowOption,
        formatter: xAxisLabels.labelFormatter,
      },
    }),
  ];
}

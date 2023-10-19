import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { getEchartsXAxisLabel } from '../editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IScatterChartConf } from '../type';

export function getXAxes(conf: IScatterChartConf, xAxisData: $TSFixMe[]) {
  const allNumbers = xAxisData.every((d) => !Number.isNaN(Number(d)));
  const { axisLabel } = conf.x_axis;
  const xDataEmpty = xAxisData.length === 0;
  return [
    defaultEchartsOptions.getXAxis({
      data: xAxisData,
      name: conf.x_axis.name ?? '',
      nameGap: xDataEmpty ? 5 : undefined,
      id: 'main-x-axis',
      type: allNumbers ? 'value' : 'category',
      axisLabel: {
        ...axisLabel,
        formatter: getEchartsXAxisLabel(axisLabel.formatter),
      },
    }),
  ];
}

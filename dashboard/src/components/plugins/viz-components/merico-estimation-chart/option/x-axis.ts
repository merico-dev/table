import { getEchartsXAxisLabel } from '~/components/plugins/common-echarts-fields/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IMericoEstimationChartConf } from '../type';

export function getXAxes(conf: IMericoEstimationChartConf, xAxisData: string[]) {
  const { axisLabel } = conf.x_axis;
  return [
    {
      data: xAxisData,
      id: '准确估算比例',
      gridIndex: 0,
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      type: 'category',
    },
    {
      data: xAxisData,
      id: '平均偏差',
      gridIndex: 1,
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#FFFFFF',
          width: 2,
        },
      },
      type: 'category',
    },
    {
      data: xAxisData,
      id: '数量占比',
      gridIndex: 2,
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      type: 'category',
    },
    {
      data: xAxisData,
      id: '代码当量',
      gridIndex: 3,
      axisTick: {
        show: false,
      },
      type: 'category',
      axisLabel: {
        ...axisLabel,
        formatter: getEchartsXAxisLabel(axisLabel.formatter),
      },
      axisLine: {
        show: false,
      },
    },
  ];
}

import { IEchartsTooltipMetric } from '~/plugins/common-echarts-fields/tooltip-metric';

export function getYAxes(metric: IEchartsTooltipMetric) {
  return [
    {
      type: 'category',
      name: '准确估算比例',
      nameRotate: 0,
      nameGap: 5,
      nameLocation: 'end',
      nameTextStyle: {
        align: 'left',
      },
      gridIndex: 0,
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    {
      type: 'value',
      name: '平均偏差',
      nameGap: 5,
      nameRotate: 90,
      nameLocation: 'middle',
      gridIndex: 1,
      boundaryGap: [1, 1],
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    {
      type: 'value',
      name: '数量占比',
      nameGap: 5,
      nameRotate: 90,
      nameLocation: 'middle',
      gridIndex: 2,
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      min: 0,
      max: 1,
    },
    {
      type: 'value',
      gridIndex: 3,
      position: 'right',
      splitNumber: 3,
      axisLabel: {
        show: true,
        verticalAlign: 'top',
        showMinLabel: false,
        lineHeight: 14,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    {
      type: 'value',
      name: metric.name,
      nameGap: 5,
      nameRotate: 90,
      nameLocation: 'middle',
      gridIndex: 3,
      position: 'left',
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
  ];
}

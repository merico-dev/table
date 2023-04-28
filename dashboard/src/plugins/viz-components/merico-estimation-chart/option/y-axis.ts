import { IMericoEstimationChartConf } from '../type';

export function getYAxes(conf: IMericoEstimationChartConf, data: TVizData) {
  return [
    {
      type: 'value',
      name: '', // 准确估算比例
      nameRotate: 0,
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
      min: -4,
      max: 4,
      boundaryGap: [30, 100],
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
    },
    {
      type: 'value',
      name: '代码当量',
      nameGap: 5,
      nameRotate: 90,
      nameLocation: 'middle',
      gridIndex: 3,
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

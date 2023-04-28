import { getEchartsXAxisLabel } from '~/plugins/common-echarts-fields/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IMericoEstimationChartConf } from '../type';
import _ from 'lodash';

export function getXAxes(conf: IMericoEstimationChartConf, xAxisData: string[]) {
  const { axisLabel } = conf.x_axis;
  return [
    {
      data: xAxisData,
      id: '准确估算比例',
      name: '准确估算比例',
      nameLocation: 'middle',
      nameGap: 5,
      position: 'top',
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
        show: false,
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
        show: true,
        alignWithLabel: true,
      },
      type: 'category',
      axisLabel: {
        ...axisLabel,
        formatter: getEchartsXAxisLabel(axisLabel.formatter),
      },
    },
  ];
}

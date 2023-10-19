import { IParetoChartConf } from '../type';
import { TParetoFormatters } from './utils';

export function getYAxes(conf: IParetoChartConf, formatters: TParetoFormatters) {
  return [
    {
      name: conf.bar.name,
      nameGap: 20,
      minInterval: 1,
      nameTextStyle: {
        align: conf.bar.nameAlignment,
      },
      position: 'left',
      axisLine: {
        show: false,
        lineStyle: {
          width: 3,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        formatter: formatters.bar,
      },
      splitLine: {
        show: false,
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    {
      name: conf.line.name,
      nameGap: 20,
      nameTextStyle: {
        align: conf.line.nameAlignment,
      },
      position: 'right',
      axisLine: {
        show: false,
        lineStyle: {
          width: 3,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        formatter: formatters.lineValue,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
        },
      },
    },
  ];
}

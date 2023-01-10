import { IParetoChartConf } from '../type';
import { formatPercentage } from './utils';

export function getYAxes(conf: IParetoChartConf) {
  return [
    {
      name: conf.bar.name,
      nameGap: 20,
      nameTextStyle: {
        fontWeight: 'bold',
        align: 'right',
      },
      position: 'left',
      axisLine: {
        show: true,
      },
      splitLine: {
        show: false,
      },
    },
    {
      name: conf.line.name,
      nameGap: 20,
      nameTextStyle: {
        fontWeight: 'bold',
        align: 'center',
      },
      position: 'right',
      axisLine: {
        show: true,
      },
      axisLabel: {
        show: true,
        formatter: formatPercentage,
      },
      splitLine: {
        show: false,
      },
    },
  ];
}

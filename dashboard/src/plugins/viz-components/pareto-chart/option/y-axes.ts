import { IParetoChartConf } from '../type';
import { formatPercentage } from './utils';

export function getYAxes(conf: IParetoChartConf) {
  return [
    {
      name: conf.bar.name,
      nameGap: 30,
      nameTextStyle: {
        fontWeight: 'bold',
        align: 'right',
      },
      axisLine: {
        show: true,
      },
      splitLine: {
        show: false,
      },
    },
    {
      name: conf.line.name,
      nameGap: 30,
      nameTextStyle: {
        fontWeight: 'bold',
        align: 'center',
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

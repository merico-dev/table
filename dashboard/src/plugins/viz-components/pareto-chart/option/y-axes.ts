import { IParetoChartConf } from '../type';
import { TParetoFormatters } from './utils';

export function getYAxes(conf: IParetoChartConf, formatters: TParetoFormatters) {
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
      axisLabel: {
        show: true,
        formatter: formatters.bar,
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
        formatter: formatters.lineValue,
      },
      splitLine: {
        show: false,
      },
    },
  ];
}

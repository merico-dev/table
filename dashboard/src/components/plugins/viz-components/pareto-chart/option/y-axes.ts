import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { IParetoChartConf } from '../type';
import { TParetoFormatters } from './utils';

export function getYAxes(conf: IParetoChartConf, formatters: TParetoFormatters) {
  return [
    defaultEchartsOptions.getYAxis({
      name: conf.bar.name,
      nameGap: 20,
      minInterval: 1,
      nameTextStyle: {
        align: conf.bar.nameAlignment,
      },
      position: 'left',
      axisLabel: {
        show: true,
        formatter: formatters.bar,
      },
      splitLine: {
        show: false,
      },
    }),
    defaultEchartsOptions.getYAxis({
      name: conf.line.name,
      nameGap: 20,
      nameTextStyle: {
        align: conf.line.nameAlignment,
      },
      position: 'right',
      axisLabel: {
        show: true,
        formatter: formatters.lineValue,
      },
    }),
  ];
}

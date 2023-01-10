import { IParetoChartConf } from '../type';

export function getXAxis(conf: IParetoChartConf) {
  return [
    {
      type: 'category',
      name: conf.x_axis.name,
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        fontWeight: 'bold',
        align: 'right',
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: true,
        alignWithLabel: true,
      },
    },
  ];
}

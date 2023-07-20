import { IBoxplotChartConf } from '../type';

export function getLegend({ config }: { config: IBoxplotChartConf }) {
  const ret: Record<string, any> = {
    show: true,
    top: 0,
    right: 10,
    type: 'scroll',
    data: [
      {
        name: 'Box',
        icon: 'roundRect',
        itemStyle: {
          color: config.color,
        },
      },
      {
        name: 'Outlier',
        icon: 'circle',
        itemStyle: {
          color: '#2F8CC0',
        },
      },
    ],
  };

  return ret;
}

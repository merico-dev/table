import { IBoxplotChartConf } from '../type';

export function getLegend({ config }: { config: IBoxplotChartConf }) {
  const ret: Record<string, any> = {
    ...config.legend,
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
          color: '#ED6A45',
        },
      },
    ],
  };

  return ret;
}

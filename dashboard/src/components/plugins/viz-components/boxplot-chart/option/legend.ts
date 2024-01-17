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
        name: 'Scatter',
        icon: 'circle',
        itemStyle: {
          color: '#ED6A45',
          opacity: 0.5,
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
  if (config.legend.orient === 'horizontal' && config.dataZoom.x_axis_slider) {
    ret.top = 15;
  }

  return ret;
}

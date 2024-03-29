import { IBoxplotChartConf } from '../type';
import { SeriesNames } from './type';

export function getLegend({ config, seriesNames }: { config: IBoxplotChartConf; seriesNames: SeriesNames }) {
  const ret: Record<string, any> = {
    ...config.legend,
    data: [
      {
        name: seriesNames.Box,
        icon: 'roundRect',
        itemStyle: {
          color: config.color,
        },
      },
      {
        name: seriesNames.Scatter,
        icon: 'circle',
        itemStyle: {
          color: '#ED6A45',
          opacity: 0.5,
        },
      },
      {
        name: seriesNames.Outlier,
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

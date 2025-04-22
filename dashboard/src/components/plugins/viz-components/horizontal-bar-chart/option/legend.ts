import { IHorizontalBarChartConf } from '../type';
import { IEchartsSeriesItem, TEchartsSeriesType } from './utils/types';

function getIcon(type: TEchartsSeriesType) {
  switch (type) {
    case 'bar':
      return 'roundRect';
    case 'scatter':
      return 'circle';
  }
}

export function getLegend(conf: IHorizontalBarChartConf, series: IEchartsSeriesItem[]) {
  const unitMap = conf.series.reduce((ret, { unit, name }) => {
    if (unit.show_in_legend) {
      ret[name] = unit.text;
    }
    return ret;
  }, {} as Record<string, string>);

  const ret: Record<string, any> = {
    show: true,
    bottom: 0,
    left: 'center',
    type: 'scroll',
    formatter: (name: string) => {
      const unit = unitMap[name];
      return !!unit ? `${name}(${unit})` : name;
    },
  };

  ret.data = series
    .filter((s) => !s.hide_in_legend)
    .map(({ name, type }) => {
      return {
        name,
        icon: getIcon(type),
      };
    });

  return ret;
}

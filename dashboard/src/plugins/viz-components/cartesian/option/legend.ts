import { ICartesianChartConf } from '../type';

function getIcon(type: 'line' | 'bar' | 'scatter') {
  switch (type) {
    case 'line':
      // returning 'line' won't work, it will render empty icon
      return undefined;
    case 'bar':
      return 'roundRect';
    case 'scatter':
      return 'circle';
  }
}

export function getLegend(conf: ICartesianChartConf) {
  const ret: Record<string, any> = {
    show: true,
    bottom: 0,
    left: 'center',
    type: 'scroll',
  };

  ret.data = conf.series.map(({ name, type }) => {
    return {
      name,
      icon: getIcon(type),
    };
  });
  return ret;
}

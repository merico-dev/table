import { AnyObject } from '~/types';

export function getLegend(series: AnyObject[]) {
  const data = series
    .filter((s) => s.show_in_legend)
    .reverse()
    .map((s) => ({
      name: `${s.name}`,
      color: s.color,
    }));
  return {
    show: true,
    orient: 'vertical',
    top: 'middle',
    right: 0,
    data,
    tooltip: {
      show: true,
      formatter: '档位偏差：{a}',
    },
  };
}

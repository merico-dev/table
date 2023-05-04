import { AnyObject } from '~/types';

export function getLegend(series: AnyObject[]) {
  return {
    show: true,
    orient: 'vertical',
    top: 'middle',
    right: 0,
    data: series
      .filter((s) => s.show_in_legend)
      .reverse()
      .map((s) => ({
        name: `${s.name}`,
      })),
  };
}

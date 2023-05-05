import { AnyObject } from '~/types';

function getItemStyle(color: string) {
  if (color === 'rgba(255, 255, 255, 1)') {
    return {
      borderColor: 'rgba(0,0,0,.1)',
      borderWidth: 1,
    };
  }
  return {};
}

export function getLegend(series: AnyObject[]) {
  const data = series
    .filter((s) => s.show_in_legend)
    .reverse()
    .map((s) => ({
      name: `${s.name}`,
      color: s.color,
      itemStyle: getItemStyle(s.color),
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

import { IParetoChartConf } from '../type';
import { getMarkLineAndArea } from './mark-line-and-area';
import { BarData, TLineDataItem } from './types';
import { TParetoFormatters } from './utils';

export function getSeries(conf: IParetoChartConf, barData: BarData, formatters: TParetoFormatters) {
  const sum = barData.reduce((sum, curr) => sum + curr[1], 0);
  const lineData = barData
    .reduce((ret, curr, index) => {
      const prevValue = index === 0 ? 0 : ret[index - 1][1];
      ret.push([curr[0], prevValue + curr[1]]);
      return ret;
    }, [] as TLineDataItem[])
    .map((row) => [row[0], row[1] / sum] as TLineDataItem);

  const { markLine, markArea } = getMarkLineAndArea(conf, lineData);
  return [
    {
      name: conf.bar.name,
      type: 'bar',
      barMaxWidth: 20,
      itemStyle: {
        color: conf.bar.color,
      },
      label: {
        show: false,
        position: 'top',
        formatter: formatters.bar,
      },
      yAxisIndex: 0,
      data: barData,
    },
    {
      name: conf.line.name,
      type: 'line',
      itemStyle: {
        color: conf.line.color,
      },
      symbolSize: 2,
      lineStyle: {
        width: 1,
        shadowColor: 'rgba(255,255,255,1)',
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 1,
      },
      label: {
        show: false,
        position: 'top',
        formatter: formatters.line,
      },
      yAxisIndex: 1,
      data: lineData,
      markLine,
      markArea,
    },
  ];
}

import { AnyObject } from '~/types';
import { IParetoChartConf } from '../type';
import { getMarkLine } from './mark-line';
import { TLineDataItem } from './types';
import { TParetoFormatters } from './utils';
import { parseDataKey } from '~/utils/data';

export function getSeries(conf: IParetoChartConf, data: TPanelData, formatters: TParetoFormatters) {
  const { x_axis, data_key } = conf;
  if (!x_axis.data_key || !data_key) {
    return [];
  }
  const x = parseDataKey(x_axis.data_key);
  const y = parseDataKey(data_key);
  if (x.queryID !== y.queryID) {
    throw new Error('Please use the same query for X & Y axis');
  }

  const barData = data[x.queryID].map((d) => [d[x.columnKey], Number(d[y.columnKey])]).sort((a, b) => b[1] - a[1]);
  const sum = barData.reduce((sum, curr) => sum + curr[1], 0);
  const lineData = barData
    .reduce((ret, curr, index) => {
      const prevValue = index === 0 ? 0 : ret[index - 1][1];
      ret.push([curr[0], prevValue + curr[1]]);
      return ret;
    }, [] as TLineDataItem[])
    .map((row) => [row[0], row[1] / sum] as TLineDataItem);

  const markLine = getMarkLine(conf, lineData);
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
      },
      label: {
        show: false,
        position: 'top',
        formatter: formatters.line,
      },
      yAxisIndex: 1,
      data: lineData,
      markLine,
    },
  ];
}

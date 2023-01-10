import { CallbackDataParams } from 'echarts/types/dist/shared';
import { IParetoChartConf } from '../type';
import { formatPercentage } from './utils';

function tooltipFormatter(params: CallbackDataParams) {
  const arr = Array.isArray(params) ? params : [params];
  if (arr.length === 0) {
    return '';
  }
  const lines = arr.map((row, index) => {
    const seriesName = row.seriesName;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_x, value] = row.value as [string, number];
    if (!seriesName) {
      return value;
    }
    const formatter = index === 0 ? (v: number) => v : formatPercentage;
    return `
    <tr>
      <th style="text-align: right; padding: 0 1em;">${seriesName}</th>
      <td style="text-align: left; padding: 0 1em;">${formatter(value as number)}</td>
    </tr>
  `;
  });
  return `
    <table>
      <caption style="text-align: left; padding: 0 1em .5em; font-weight: bold; border-bottom: 1px dashed #ddd;">
        ${arr[0].name}
      </caption>
      <tbody>
        ${lines.join('')}
      </tbody>
    </table>
  `;
}

export function getTooltip(conf: IParetoChartConf) {
  return {
    trigger: 'axis',
    formatter: tooltipFormatter,
  };
}

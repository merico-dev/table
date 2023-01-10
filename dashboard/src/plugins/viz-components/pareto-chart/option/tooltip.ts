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
    return `${seriesName}: <strong>${formatter(value as number)}</strong>`;
  });
  lines.unshift(`<strong>${arr[0].name}</strong>`);
  return lines.join('<br />');
}

export function getTooltip(conf: IParetoChartConf) {
  return {
    trigger: 'axis',
    formatter: tooltipFormatter,
  };
}

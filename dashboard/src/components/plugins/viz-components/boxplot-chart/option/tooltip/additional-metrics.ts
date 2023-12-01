import { AnyObject } from '~/types';
import { formatNumber, parseDataKey } from '~/utils';
import { IBoxplotChartConf } from '../../type';

const formatAdditionalMetric = (v: number) => {
  try {
    return formatNumber(v, {
      output: 'number',
      trimMantissa: true,
      mantissa: 2,
      absolute: false,
    });
  } catch (error) {
    return v;
  }
};

export function getAdditionalMetrics(config: IBoxplotChartConf, dataItem: AnyObject) {
  return config.tooltip.metrics.map((m) => {
    const k = parseDataKey(m.data_key);
    return `
    <tr>
      <th style="text-align: right; padding: 0 1em;">${m.name}</th>
      <td style="text-align: left; padding: 0 1em;">${formatAdditionalMetric(dataItem[k.columnKey])}</td>
    </tr>`;
  });
}

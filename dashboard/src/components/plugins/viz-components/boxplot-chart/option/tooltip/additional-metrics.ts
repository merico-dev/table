import { parseDataKey } from '~/utils/data';
import { IBoxplotChartConf, TOutlierDataItem, TScatterDataItem } from '../../type';
import numbro from 'numbro';
import { AnyObject } from '~/types';

const formatAdditionalMetric = (v: number) => {
  try {
    return numbro(v).format({
      trimMantissa: true,
      mantissa: 2,
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

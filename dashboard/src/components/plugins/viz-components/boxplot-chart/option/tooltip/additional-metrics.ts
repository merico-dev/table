import { AnyObject } from '~/types';
import { formatNumber, parseDataKey } from '~/utils';
import { IBoxplotChartConf } from '../../type';

const formatAdditionalMetric = (v: number) => {
  return formatNumber(v, {
    output: 'number',
    trimMantissa: true,
    mantissa: 2,
    absolute: false,
  });
};

export function getAdditionalMetrics(config: IBoxplotChartConf, dataItem: AnyObject) {
  const metricUnitMap = config.tooltip.metrics.reduce((ret, { unit, name }) => {
    if (unit.show_in_tooltip) {
      ret[name] = unit.text;
    }
    return ret;
  }, {} as Record<string, string>);

  return config.tooltip.metrics.map((m) => {
    const k = parseDataKey(m.data_key);
    const unit = metricUnitMap[m.name] ?? '';
    return `
    <tr>
      <th style="text-align: right; padding: 0 1em;">${m.name}</th>
      <td style="text-align: left; padding: 0 2px 0 1em;">${formatAdditionalMetric(dataItem[k.columnKey])}</td>
      <th style="text-align: left; padding: 0;">
        ${unit ?? ''}
      </th>
    </tr>`;
  });
}

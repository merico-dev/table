import numbro from 'numbro';
import { getLabelOverflowStyleInTooltip } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { IBoxplotChartConf, TOutlierDataItem } from '../../type';
import { parseDataKey } from '~/utils/data';

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

export function getScatterTooltipContent(config: IBoxplotChartConf, value: TOutlierDataItem) {
  const xAxisLabelStyle = getLabelOverflowStyleInTooltip(config.x_axis.axisLabel.overflow.in_tooltip);
  const metrics = [
    `<tr>
      <th style="text-align: right; padding: 0 1em;">Outlier</th>
      <td style="text-align: left; padding: 0 1em;">${value[1]}</td>
    </tr>
    `,
  ];

  const additionalMetrics = config.tooltip.metrics.map((m) => {
    const k = parseDataKey(m.data_key);
    return `
    <tr>
      <th style="text-align: right; padding: 0 1em;">${m.name}</th>
      <td style="text-align: left; padding: 0 1em;">${formatAdditionalMetric(value[2][k.columnKey])}</td>
    </tr>`;
  });

  metrics.push(...additionalMetrics);

  const template = `
    <div style="text-align: left; margin-bottom: .5em; padding: 0 1em .5em; font-weight: bold; border-bottom: 1px dashed #ddd;">
      <div style="${xAxisLabelStyle}">${value[0]}</div>
    </div>
    <table>
      <tbody>
        ${metrics.join('')}
      </tbody>
    </table>
  `;

  return template;
}

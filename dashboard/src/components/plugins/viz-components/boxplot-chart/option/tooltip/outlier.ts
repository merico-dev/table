import { getLabelOverflowStyleInTooltip } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { IBoxplotChartConf, TOutlierDataItem } from '../../type';
import { getAdditionalMetrics } from './additional-metrics';

export function getOutlierTooltipContent(config: IBoxplotChartConf, value: TOutlierDataItem) {
  const xAxisLabelStyle = getLabelOverflowStyleInTooltip(config.x_axis.axisLabel.overflow.in_tooltip);
  const metrics = [
    `<tr>
      <th style="text-align: right; padding: 0 1em;">${config.y_axis.name}</th>
      <td style="text-align: left; padding: 0 1em;">${value[1]}</td>
    </tr>
    `,
  ];

  const additionalMetrics = getAdditionalMetrics(config, value[2]);

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

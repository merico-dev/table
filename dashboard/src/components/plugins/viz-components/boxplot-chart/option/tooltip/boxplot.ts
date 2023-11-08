import _ from 'lodash';
import numbro from 'numbro';
import { getLabelOverflowStyleInTooltip } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { IBoxplotChartConf, IBoxplotDataItem } from '../../type';
import { BOXPLOT_DATA_ITEM_KEYS } from '../common';

export const getBoxplotTooltipContent = (config: IBoxplotChartConf, value: IBoxplotDataItem) => {
  const lines = BOXPLOT_DATA_ITEM_KEYS.map((key) => {
    return `
    <tr>
      <th style="text-align: right; padding: 0 1em;">${_.capitalize(key)}</th>
      <td style="text-align: left; padding: 0 1em;">
        ${numbro(value[key]).format(config.y_axis.label_formatter)}
      </td>
    </tr>`;
  });

  const xAxisLabelStyle = getLabelOverflowStyleInTooltip(config.x_axis.axisLabel.overflow.in_tooltip);
  const template = `
    <div style="text-align: left; margin-bottom: .5em; padding: 0 1em .5em; font-weight: bold; border-bottom: 1px dashed #ddd;">
      <div style="${xAxisLabelStyle}">${value.name}</div>
    </div>
    <table style="width: auto">
      <tbody>
        ${lines.join('')}
      </tbody>
    </table>
  `;
  return template;
};

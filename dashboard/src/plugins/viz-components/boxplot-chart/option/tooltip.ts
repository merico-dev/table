import _ from 'lodash';
import numbro from 'numbro';
import { AnyObject } from '~/types';
import { getXAxisLabelStyleInTooltip } from '../../cartesian/panel/x-axis/x-axis-label-overflow/utils';
import { IBoxplotChartConf } from '../type';
import { BOXPLOT_DATA_ITEM_KEYS } from './common';

function getScatterTooltipContent(config: IBoxplotChartConf, value: [string, number]) {
  const xAxisLabelStyle = getXAxisLabelStyleInTooltip(config.x_axis.axisLabel.overflow);
  const template = `
    <div style="text-align: left; margin-bottom: .5em; padding: 0 1em .5em; font-weight: bold; border-bottom: 1px dashed #ddd;">
      <div style="${xAxisLabelStyle}">${value[0]}</div>
    </div>
    <table>
      <tbody>
        <tr>
          <th style="text-align: right; padding: 0 1em;">Outlier</th>
          <td style="text-align: left; padding: 0 1em;">${value[1]}</td>
        </tr>
      </tbody>
    </table>
  `;
  return template;
}

const getFormatter = (config: IBoxplotChartConf) => (params: AnyObject) => {
  const { componentSubType, value } = params;

  if (componentSubType === 'scatter') {
    return getScatterTooltipContent(config, value as [string, number]);
  }

  const lines = BOXPLOT_DATA_ITEM_KEYS.map((key) => {
    return `
    <tr>
      <th style="text-align: right; padding: 0 1em;">${_.capitalize(key)}</th>
      <td style="text-align: left; padding: 0 1em;">
        ${numbro(value[key]).format(config.y_axis.label_formatter)}
      </td>
    </tr>`;
  });

  const xAxisLabelStyle = getXAxisLabelStyleInTooltip(config.x_axis.axisLabel.overflow);
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

export function getTooltip({ config }: { config: IBoxplotChartConf }) {
  return {
    trigger: 'item',
    confine: true,
    formatter: getFormatter(config),
  };
}

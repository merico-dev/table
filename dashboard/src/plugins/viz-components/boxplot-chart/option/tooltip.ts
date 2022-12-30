import _ from 'lodash';
import numbro from 'numbro';
import { AnyObject } from '~/types';
import { IBoxplotChartConf } from '../type';
import { BOXPLOT_DATA_ITEM_KEYS } from './common';

function getScatterTooltipContent(value: [string, number]) {
  const template = `
    <table>
    <thead>
      <th colspan="2" style="text-align: left;">${value[0]}</th>
    </thead>
      <tbody>
        <tr>
          <th style="text-align: left;">Outlier</th>
          <td style="text-align: right;">${value[1]}</td>
        </tr>
      </tbody>
    </table>
  `;
  return template;
}

const getFormatter = (config: IBoxplotChartConf) => (params: AnyObject) => {
  const { componentSubType, value } = params;

  if (componentSubType === 'scatter') {
    return getScatterTooltipContent(value as [string, number]);
  }

  const lines = BOXPLOT_DATA_ITEM_KEYS.map((key) => {
    return `
    <tr>
      <th style="text-align: left;">${_.capitalize(key)}</th>
      <td style="text-align: right;">
        ${numbro(value[key]).format(config.y_axis.label_formatter)}
      </td>
    </tr>`;
  });

  const template = `
    <table>
      <thead>
        <tr>
          <th colspan="2" style="text-align: left;">${value.name}</th>
        </tr>
      </thead>
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

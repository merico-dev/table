import { TopLevelFormatterParams } from 'echarts/types/dist/shared';
import _ from 'lodash';
import numbro from 'numbro';
import { IBoxplotChartConf, IBoxplotDataItem } from '../type';
import { BOXPLOT_DATA_ITEM_KEYS } from './common';

const getFormatter = (config: IBoxplotChartConf) => (params: TopLevelFormatterParams) => {
  if (!Array.isArray(params) || params.length === 0) {
    return;
  }

  const value = params[0].value as IBoxplotDataItem;
  const lines = BOXPLOT_DATA_ITEM_KEYS.map((key) => {
    return `
    <tr>
      <td>${_.capitalize(key)}</td>
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
    trigger: 'axis',
    confine: true,
    formatter: getFormatter(config),
  };
}

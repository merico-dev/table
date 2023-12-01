import { CallbackDataParams } from 'echarts/types/dist/shared';
import _ from 'lodash';
import numbro from 'numbro';
import { AnyObject } from '~/types';
import { IFunnelConf } from '../type';
import { parseDataKey } from '~/utils';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';

interface IGetRows {
  conf: IFunnelConf;
  params: CallbackDataParams;
  max: number;
}

function getRows({ conf, params, max }: IGetRows) {
  const { name, value } = params.data as { name: string; value: number };
  const percentage = numbro(value / max).format({ output: 'percent', mantissa: 2, trimMantissa: true });
  const valueRow = {
    label: `${params.marker} ${name}`,
    value: `${value} (${percentage})`,
    style: {
      label: '',
      value: '',
    },
  };
  const ret = [valueRow];
  return ret;
}
function getTooltipFormatter(conf: IFunnelConf, data: TPanelData) {
  const n = parseDataKey(conf.series[0].level_name_data_key);
  const v = parseDataKey(conf.series[0].level_value_data_key);
  const max = _.maxBy(data[n.queryID], v.columnKey)?.[v.columnKey];
  return (params: CallbackDataParams) => {
    const rows = getRows({ conf, params, max });
    const trs = rows.map((r) => {
      return `
          <tr>
            <th style="text-align: right;">
              <div style="${r.style.label}">${r.label}</div>
            </th>
            <td style="text-align: right; padding: 0 1em;">
            <div style="${r.style.value}">${r.value}
            </td>
          </tr>
        `;
    });
    const template = `
      <div style="text-align: left; margin-bottom: .5em; padding: 0 1em .5em; font-weight: bold; border-bottom: 1px dashed #ddd;">
        ${params.seriesName}
      </div>
      <table style="width: auto">
        <tbody>${trs.join('')}</tbody>
      </table>
    `;

    return template;
  };
}

export function getTooltip(conf: IFunnelConf, data: TPanelData) {
  return defaultEchartsOptions.getTooltip({
    trigger: 'item',
    formatter: getTooltipFormatter(conf, data),
  });
}

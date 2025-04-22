import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { formatNumber } from '~/utils';
import { IEchartsSunburstLabelFormatter } from './types';
import { ISunburstConf } from '../type';

function getFormatter(unit: string) {
  return ({ treePathInfo, name, value, color, marker, ...rest }: IEchartsSunburstLabelFormatter) => {
    const path = treePathInfo.slice(0, treePathInfo.length - 1); // exclude last one, which is current item

    const metrics = [
      `<tr>
        <th style="text-align: right; padding: 0 1em;">Value</th>
        <td style="text-align: left; padding: 0 2px 0 1em;">${value}</td>
        <th style="text-align: left; padding: 0;">
          ${unit ?? ''}
        </th>
      </tr>
      `,
    ];
    path.reverse().forEach(({ value: pv, name: pn }) => {
      metrics.push(`
        <tr>
          <th style="text-align: right; padding: 0 1em;">${pn ? pn : 'Total'}</th>
          <td style="text-align: left; padding: 0 2px 0 1em;" colspan="2">
            ${formatNumber(value / pv, { output: 'percent', mantissa: 2, trimMantissa: true, absolute: false })}
          </td>
        </tr>
      `);
    });

    const template = `
    <div style="text-align: left; margin-bottom: .5em; padding: 0 1em .5em; font-weight: bold; border-bottom: 1px dashed #ddd;">
      <div>${marker} ${name}</div>
      </div>
      <table style="width: auto">
        <tbody>${metrics.join('')}</tbody>
      </table>
      `;

    return template;
  };
}

export function getTooltip(conf: ISunburstConf) {
  const unit = conf.unit.show_in_tooltip ? conf.unit.text : '';
  return defaultEchartsOptions.getTooltip({
    trigger: 'item',
    formatter: getFormatter(unit),
  });
}

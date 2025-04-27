import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { OthersSectorItem } from './series';
import { IPieChartConf } from '../type';

function renderOthersSectorTooltip(unit: string, props: any) {
  const { name, color } = props;
  const data: OthersSectorItem = props.data;

  const lines = data.items
    .map((item) => {
      return `
      <tr>
        <th style="text-align: right; padding: 0 1em;">${item.name}</th>
        <td style="text-align: left; padding: 0 1em; font-family: monospace;">
        ${item.value}
        ${!!unit ? `<strong>${unit}</strong>` : ''}
        </td>
        <td style="text-align: left; padding: 0 1em; font-family: monospace;">${item.percentage}</td>
      </tr>
    `;
    })
    .join('');

  const template = `
    <table style="width: auto">
      <thead>
        <tr>
          <th colspan="3" style="text-align: center; padding: 0 1em;">
            ${name}
            <div style="
              width: 100%; height: 4px; border-radius: 2px; margin-bottom: 6px;
              background-color: ${color};"
            />
          </th>
        </tr>
      </thead>
      <tbody>
      ${lines}
      </tbody>
    </table>
  `;

  return template;
}

function getFormatter(unit: string) {
  return (props: any) => {
    const { name, color, data } = props;
    const { value, percentage } = props.value;
    if ('items' in data) {
      return renderOthersSectorTooltip(unit, props);
    }
    const template = `
      <table style="width: auto">
        <thead>
          <tr colspan="2">
            <div style="
              width: 100%; height: 4px; border-radius: 2px; margin-bottom: 6px;
              background-color: ${color};"
            />
          </tr>
        </thead>
        <tbody>
          <tr>
            <th style="text-align: right; padding: 0 1em; ">${name}</th>
            <td style="text-align: left; padding: 0 0.5em 0 0; font-family: monospace;">${value}<strong>${unit}</strong></td>
            <td style="text-align: left; padding: 0 0 0 0.5em; font-family: monospace;">${percentage}</td>
          </tr>
        </tbody>
      </table>
      `;

    return template;
  };
}

export function getTooltip(conf: IPieChartConf) {
  const unit = conf.unit.show_in_tooltip ? conf.unit.text : '';
  return defaultEchartsOptions.getTooltip({
    trigger: 'item',
    formatter: getFormatter(unit),
  });
}

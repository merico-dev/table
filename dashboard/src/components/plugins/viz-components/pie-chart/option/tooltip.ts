import { defaultEchartsOptions } from '~/styles/default-echarts-options';

function getFormatter() {
  return ({ name, value, color }: any) => {
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
            <th style="text-align: right; padding: 0 1em;">${name}</th>
            <td style="text-align: left; padding: 0 1em;">${value}</td>
          </tr>
        </tbody>
      </table>
      `;

    return template;
  };
}

export function getTooltip() {
  return defaultEchartsOptions.getTooltip({
    trigger: 'item',
    formatter: getFormatter(),
  });
}

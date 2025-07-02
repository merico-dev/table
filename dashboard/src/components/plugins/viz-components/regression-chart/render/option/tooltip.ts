import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { ParsedDataKey } from '~/utils';

type TFormatterParams = {
  color: string;
  marker: string;
  seriesName: string;
  value: [number, number];
};

function getRows(params: TFormatterParams | TFormatterParams[]) {
  if (!Array.isArray(params)) {
    params = [params];
  }
  return params.map((p) => {
    return {
      marker: p.marker,
      label: p.seriesName,
      x: p.value[0],
      y: p.value[1],
    };
  });
}

export function getTooltip(x: ParsedDataKey, y: ParsedDataKey) {
  return defaultEchartsOptions.getTooltip({
    trigger: 'axis',
    formatter: (params: TFormatterParams | TFormatterParams[]) => {
      const rows = getRows(params);
      if (rows.length === 0) {
        return '';
      }
      const template = `
        <table style="width: auto">
          <thead>
            <tr>
              <th/>
              ${rows.map(({ marker, label }) => `<th style="padding: 0 .5em;">${marker} ${label}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th style="text-align: left; padding: 0 .5em;">${x.columnKey}</th>
              ${rows.map(({ x }) => `<td style="text-align: right; padding: 0 .5em;">${x}</td>`).join('')}
            </tr>
            <tr>
              <th style="text-align: left; padding: 0 .5em;">${y.columnKey}</th>
              ${rows.map(({ y }) => `<td style="text-align: right; padding: 0 .5em;">${y}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      `;

      return template;
    },
  });
}

import { IRegressionChartConf } from '../type';

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

export function getTooltip(conf: IRegressionChartConf) {
  return {
    confine: true,
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
              <th style="text-align: left; padding: 0 .5em;">${conf.x_axis.name}</th>
              ${rows.map(({ x }) => `<td style="text-align: right; padding: 0 .5em;">${x}</td>`).join('')}
            </tr>
            <tr>
              <th style="text-align: left; padding: 0 .5em;">${conf.y_axis.name}</th>
              ${rows.map(({ y }) => `<td style="text-align: right; padding: 0 .5em;">${y}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      `;

      return template;
    },
  };
}

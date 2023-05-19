import { IRegressionChartConf } from '../type';

type TFormatterParams = {
  color: string;
  marker: string;
  name: string;
  value: [number, number];
};

function getRows(params: TFormatterParams | TFormatterParams[]) {
  if (!Array.isArray(params)) {
    params = [params];
  }
  return params.map((p) => {
    return {
      marker: p.marker,
      x: p.value[0],
      y: p.value[1],
    };
  });
}

export function getTooltip(conf: IRegressionChartConf) {
  return {
    // trigger: 'axis',
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
              <th style="text-align: left; padding: 0 1em;">${conf.x_axis.name}</th>
              <th style="text-align: left; padding: 0 1em;">${conf.y_axis.name}</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(({ marker, x, y }) => {
                return `
                <tr>
                  <td>${marker}</td>
                  <td style="text-align: left; padding: 0 1em;">${x}</td>
                  <td style="text-align: left; padding: 0 1em;">${y}</td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      `;

      return template;
    },
  };
}

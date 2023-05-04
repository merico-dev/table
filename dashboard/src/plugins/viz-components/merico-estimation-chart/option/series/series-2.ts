import * as mathjs from 'mathjs';
import { AnyObject } from '~/types';
import { IMericoEstimationChartConf } from '../../type';

export function getSeries2(
  conf: IMericoEstimationChartConf,
  xAxisData: string[],
  dataGroupedByX: Record<string, TVizData>,
  commonConf: AnyObject,
) {
  const { actual } = conf.y_axis.data_keys;
  const chartData = xAxisData.map((x) => {
    const data = dataGroupedByX[x].map((d) => d[actual]);
    const mad = mathjs.mad(data);
    return [x, mad];
  });
  return {
    type: 'bar',
    name: '平均偏差',
    xAxisIndex: 1,
    yAxisIndex: 1,
    ...commonConf,
    label: {
      position: 'outside',
      show: true,
    },
    data: chartData,
    tooltip: {
      trigger: 'item',
      formatter: ({ color, value }: any) => {
        const [x, y] = value;
        const template = `
          <table style="width: auto">
            <thead>
              <tr colspan="2">
                <div style="
                  width: 100%; height: 4px; border-radius: 2px; margin-bottom: 6px;
                  background-color: ${color};"
                />
              </tr>
              <tr>
                <th colspan="2" style="text-align: center;">
                  <div>${x}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style="text-align: right;">平均偏差</th>
                <td style="text-align: left; padding: 0 1em;">${y}</td>
              </tr>
            </tbody>
          </table>
        `;

        return template;
      },
    },
  };
}

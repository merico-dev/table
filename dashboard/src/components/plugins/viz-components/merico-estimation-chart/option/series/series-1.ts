import _ from 'lodash';
import { formatNumber } from '~/utils';
import { IMericoEstimationChartConf } from '../../type';

const formatAsPercentage = ({ value }: { value: [string, string, number] }) => {
  try {
    return formatNumber(value[2], { output: 'percent', mantissa: 0, absolute: false });
  } catch (error) {
    console.error(error);
    return value;
  }
};

export function getSeries1(
  conf: IMericoEstimationChartConf,
  xAxisData: string[],
  dataGroupedByX: Record<string, TQueryData>,
) {
  const chartData = xAxisData.map((x) => {
    const total = dataGroupedByX[x].length;
    const count = _.countBy(dataGroupedByX[x], (d) => d.level.diff === 0);
    const equal = count.true ?? 0;
    const y = equal / total;
    return [x, '_y', y];
  });
  return {
    type: 'heatmap',
    name: '准确估算比例',
    xAxisIndex: 0,
    yAxisIndex: 0,
    data: chartData,
    label: {
      show: true,
      formatter: formatAsPercentage,
    },
    labelLayout: {
      hideOverlap: true,
    },
    visualMapIndex: 0,
    tooltip: {
      trigger: 'item',
      formatter: ({ color, value }: any) => {
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
                  <div>${value[0]}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style="text-align: right;">准确估算比例</th>
                <td style="text-align: left; padding: 0 1em;">${formatAsPercentage({ value })}</td>
              </tr>
            </tbody>
          </table>
        `;

        return template;
      },
    },
    show_in_legend: false,
  };
}

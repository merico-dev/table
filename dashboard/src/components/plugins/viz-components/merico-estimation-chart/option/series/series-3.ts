import _ from 'lodash';
import { interpolate } from 'popmotion';
import { AnyObject } from '~/types';
import { formatNumber } from '~/utils';
import { IMericoEstimationChartConf } from '../../type';
import { getIndicatorColorStyle } from './utils';

type DataItemType = [string | number, number, number, number];
type ChartDataType = DataItemType[];
type ChartDatasetType = Record<string | number, ChartDataType>;

function formatValues([x, p, c, s]: DataItemType) {
  const ret = {
    x,
    percentage: `${p}`,
    count: c,
    sum: s,
  };
  try {
    ret.percentage = formatNumber(p, { output: 'percent', mantissa: 2, trimMantissa: true, absolute: false });
  } catch (error) {}
  return ret;
}

export function getSeries3(
  conf: IMericoEstimationChartConf,
  xAxisData: string[],
  dataGroupedByX: Record<string, TQueryData>,
  commonConf: AnyObject,
) {
  const dataset: ChartDatasetType = {};
  xAxisData.forEach((x) => {
    const countForEach = _.countBy(dataGroupedByX[x], (d) => d.level.diff);
    const sum = _.sum(Object.values(countForEach));
    Object.entries(countForEach).forEach(([v, c]) => {
      if (!dataset[v]) {
        dataset[v] = [];
      }
      const p = c / sum;
      dataset[v].push([x, p, c, sum]);
    });
  });
  const names = Object.entries(dataset)
    .map(([name]) => Number(name))
    .sort((a, b) => a - b);

  const max = Math.max(...names);
  const min = Math.min(...names);
  const colors = interpolate([max, 0, min], ['#D15A40', '#FFF', '#418AAF']);

  const ret = names.map((name) => ({
    type: 'bar',
    name,
    xAxisIndex: 2,
    yAxisIndex: 2,
    stack: 1,
    ...commonConf,
    color: colors(name),
    data: dataset[name],
    tooltip: {
      trigger: 'item',
      formatter: ({ color, value }: any) => {
        const { x, percentage, count, sum } = formatValues(value);
        const template = `
          <table style="width: auto">
            <thead>
              <tr colspan="2">
                <div style="
                  width: 100%; height: 4px; border-radius: 2px; margin-bottom: 6px;
                  ${getIndicatorColorStyle(color)}
                  "
                />
              </tr>
              <tr>
                <th colspan="2" style="text-align: center;">
                  ${x}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style="text-align: right;">偏差档位</th>
                <td style="text-align: left; padding: 0 1em;">${name}</td>
              </tr>
              <tr>
                <th style="text-align: right;">占比</th>
                <td style="text-align: left; padding: 0 1em;">${percentage}</td>
              </tr>
              <tr>
                <th style="text-align: right;">数量</th>
                <td style="text-align: left; padding: 0 1em;">${count}</td>
              </tr>
              <tr>
                <th style="text-align: right;">总数</th>
                <td style="text-align: left; padding: 0 1em;">${sum}</td>
              </tr>
            </tbody>
          </table>
        `;

        return template;
      },
    },
    show_in_legend: true,
  }));

  return ret;
}

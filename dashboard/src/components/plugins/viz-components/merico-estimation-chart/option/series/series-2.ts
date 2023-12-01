import _ from 'lodash';
import { interpolate } from 'popmotion';
import { AnyObject } from '~/types';
import { formatNumber } from '~/utils';
import { IMericoEstimationChartConf } from '../../type';
import { getIndicatorColorStyle } from './utils';

function formatValues([x, value]: [string, number]) {
  const ret = {
    x,
    v: `${value}`,
  };
  try {
    ret.v = formatNumber(value, { output: 'number', mantissa: 2, trimMantissa: true, absolute: false });
  } catch (error) {}
  return ret;
}

export function getSeries2(
  conf: IMericoEstimationChartConf,
  xAxisData: string[],
  dataGroupedByX: Record<string, TQueryData>,
  commonConf: AnyObject,
) {
  const chartData = xAxisData.map((x) => {
    const data = dataGroupedByX[x];
    const sum = _.sumBy(data, (d) => d.level.diff);
    return [x, sum / data.length];
  });
  const max = Number(_.maxBy(chartData, (d) => d[1])?.[1] ?? 0);
  const min = Number(_.minBy(chartData, (d) => d[1])?.[1] ?? 0);
  const colors = interpolate([max, 0, min], ['#D15A40', '#FFF', '#418AAF']);
  return {
    type: 'bar',
    name: '平均偏差',
    xAxisIndex: 1,
    yAxisIndex: 1,
    ...commonConf,
    data: chartData,
    itemStyle: {
      color: ({ value }: any) => {
        try {
          return colors(value[1]);
        } catch (error) {
          return '#FFF';
        }
      },
    },
    label: {
      position: 'outside',
      show: true,
      formatter: ({ value }: any) => {
        try {
          return formatNumber(value[1], { output: 'number', mantissa: 1, trimMantissa: true, absolute: false });
        } catch (error) {
          return value[1];
        }
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: ({ color, value }: any) => {
        const { x, v } = formatValues(value);
        const template = `
          <table style="width: auto">
            <thead>
              <tr colspan="2">
                <div style="
                  width: 100%; height: 4px; border-radius: 2px; margin-bottom: 6px;
                  ${getIndicatorColorStyle(color)}
                "/>
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
                <td style="text-align: left; padding: 0 1em;">${v}</td>
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

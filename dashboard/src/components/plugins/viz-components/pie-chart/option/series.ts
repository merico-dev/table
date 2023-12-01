import { set } from 'lodash';
import { IPieChartConf } from '../type';
import { getColorFeed } from '~/utils';
import { parseDataKey } from '~/utils';

type TDataItem = {
  name: string;
  value: number;
  color?: string;
};

export function getSeries(conf: IPieChartConf, data: TPanelData, width: number) {
  const { label_field, value_field, color_field } = conf;
  if (!label_field || !value_field) {
    return {};
  }
  const label = parseDataKey(label_field);
  const value = parseDataKey(value_field);
  const color = parseDataKey(color_field);

  const chartData: TDataItem[] = data[label.queryID].map((d) => ({
    name: d[label.columnKey],
    value: Number(d[value.columnKey]),
    color: color.columnKey ? d[color.columnKey] : undefined,
  }));

  const colorFeed = getColorFeed('multiple');
  return {
    type: 'pie',
    name: 'pie',
    radius: ['50%', '80%'],
    itemStyle: {
      color: ({ data }: { data: TDataItem }) => (data.color ? data.color : colorFeed.next().value),
    },
    label: {
      position: 'outer',
      alignTo: 'edge',
      formatter: '{name|{b}}\n{percentage|{d}%}',
      minMargin: 5,
      edgeDistance: 10,
      lineHeight: 15,
      rich: {
        percentage: {
          color: '#999',
        },
      },
      margin: 20,
    },
    labelLine: {
      length: 15,
      length2: 0,
      maxSurfaceAngle: 80,
      showAbove: true,
    },
    labelLayout: function (params: $TSFixMe) {
      const isLeft = params.labelRect.x < width / 2;
      const points = params.labelLinePoints;
      set(points, [2, 0], isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width);
      return {
        labelLinePoints: points,
      };
    },
    data: chartData,
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };
}

import { set } from 'lodash';
import { getColorFeed, parseDataKey } from '~/utils';
import { IPieChartConf } from '../type';

type TDataItem = {
  name: string;
  value: number;
  color?: string;
};

type NameColorMap = Record<string, string>;

function getColor(row: Record<string, any>, colorColumnKey: string, name: string, colorMap: NameColorMap) {
  const mappedColor = colorMap[name];
  if (mappedColor) {
    return mappedColor;
  }
  return colorColumnKey ? row[colorColumnKey] : undefined;
}

export function getSeries(conf: IPieChartConf, data: TPanelData, width: number) {
  const { label_field, value_field, color_field, color } = conf;
  if (!label_field || !value_field) {
    return {};
  }
  const label = parseDataKey(label_field);
  const value = parseDataKey(value_field);
  const colorDataKey = parseDataKey(color_field);
  const colorMap = color.map.reduce((acc, curr) => {
    const { name, color } = curr;
    if (!name || !color) {
      return acc;
    }
    acc[name] = color;
    return acc;
  }, {} as NameColorMap);

  const chartData: TDataItem[] = data[label.queryID].map((d) => {
    const name = d[label.columnKey];
    return {
      name,
      value: Number(d[value.columnKey]),
      color: getColor(d, colorDataKey.columnKey, name, colorMap),
    };
  });

  const colorFeed = getColorFeed('multiple');
  return {
    type: 'pie',
    name: 'pie',
    radius: conf.radius,
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

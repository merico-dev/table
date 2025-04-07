import { set } from 'lodash';
import { getColorFeed, parseDataKey } from '~/utils';
import { IPieChartConf, PieChartOthersSector } from '../type';
import _ from 'lodash';
import * as math from 'mathjs';
import numbro from 'numbro';

type TDataItem = {
  name: string;
  value: number;
  color?: string;
  ratio?: number;
  items?: TDataItem[];
};

type NameColorMap = Record<string, string>;

function getColor(row: Record<string, any>, colorColumnKey: string, name: string, colorMap: NameColorMap) {
  const mappedColor = colorMap[name];
  if (mappedColor) {
    return mappedColor;
  }
  return colorColumnKey ? row[colorColumnKey] : undefined;
}

function makeOthersSector(others_sector: PieChartOthersSector, chartData: TDataItem[]) {
  const { label, threshold } = others_sector;
  if (!label || !threshold) {
    return chartData;
  }
  const sum = math.sum(chartData.map((v) => v.value));
  const threshold_value = numbro(`${threshold}%`).format({ output: 'number', mantissa: 8 });

  const sector = {
    name: label,
    value: 0,
    ratio: 0,
    items: [] as TDataItem[],
  };
  const data: TDataItem[] = [];
  chartData.forEach((item) => {
    item.ratio = math.divide(item.value, sum);
    if (math.larger(item.ratio, threshold_value)) {
      data.push(item);
    } else {
      sector.value = math.add(sector.value, item.value);
      sector.ratio = math.add(sector.ratio, item.ratio);
      sector.items.push(item);
    }
  });
  data.push(sector);
  return data;
}

export function getSeries(conf: IPieChartConf, data: TPanelData, width: number) {
  const { label_field, value_field, series_order, color_field, color, others_sector } = conf;
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

  let chartData: TDataItem[] = data[label.queryID].map((d) => {
    const name = d[label.columnKey];
    return {
      name,
      value: Number(d[value.columnKey]),
      color: getColor(d, colorDataKey.columnKey, name, colorMap),
    };
  });
  if (series_order) {
    chartData = _.orderBy(chartData, [series_order.key], [series_order.order]);
  }
  chartData = makeOthersSector(others_sector, chartData);

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

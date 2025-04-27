import _ from 'lodash';
import * as math from 'mathjs';
import numbro from 'numbro';
import { getColorFeed, parseDataKey } from '~/utils';
import { IPieChartConf, PieChartOthersSector } from '../type';
import { TDataItem } from './types';

export type OthersSectorItem = Required<TDataItem>;

type NameColorMap = Record<string, string>;

function getColor(row: Record<string, any>, colorColumnKey: string, name: string, colorMap: NameColorMap) {
  const mappedColor = colorMap[name];
  if (mappedColor) {
    return mappedColor;
  }
  return colorColumnKey ? row[colorColumnKey] : undefined;
}

function addRatioAndPercentage(chartData: TDataItem[]) {
  const sum = math.sum(chartData.map((v) => v.value));
  return chartData.map((item) => {
    const ratio = math.divide(item.value, sum);
    const percentage = numbro(ratio).format({ output: 'percent', mantissa: 2, trimMantissa: true });
    return {
      ...item,
      ratio,
      percentage,
    };
  });
}
function makeOthersSector(
  others_sector: PieChartOthersSector,
  chartData: TDataItem[],
  colorFeed: Generator<string, string, any>,
) {
  const { label, threshold } = others_sector;
  if (!label || !threshold) {
    return chartData;
  }
  const threshold_value = numbro(`${threshold}%`).format({ output: 'number', mantissa: 8, trimMantissa: true });

  const sector = {
    name: label,
    value: 0,
    ratio: 0,
    percentage: '',
    items: [] as TDataItem[],
    color: colorFeed.next().value,
  };
  const data: TDataItem[] = [];
  chartData.forEach((item) => {
    if (math.larger(item.ratio, threshold_value)) {
      data.push(item);
    } else {
      sector.value = math.add(sector.value, item.value);
      sector.ratio = math.add(sector.ratio, item.ratio);
      sector.percentage = numbro(sector.ratio).format({ output: 'percent', mantissa: 2, trimMantissa: true });
      sector.items.push(item);
    }
  });
  data.push(sector);
  return data;
}

export const getDataset = (conf: IPieChartConf, data: TPanelData) => {
  const { label_field, value_field, series_order, color_field, color, others_sector } = conf;
  if (!label_field || !value_field) {
    return { source: [] };
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

  const colorFeed = getColorFeed('multiple');
  let chartData: TDataItem[] = data[label.queryID].map((d) => {
    const name = d[label.columnKey];
    const color = getColor(d, colorDataKey.columnKey, name, colorMap) || colorFeed.next().value;
    return {
      name,
      value: Number(d[value.columnKey]),
      ratio: 0,
      percentage: '',
      color,
    };
  });
  if (series_order) {
    chartData = _.orderBy(chartData, [series_order.key], [series_order.order]);
  }
  chartData = addRatioAndPercentage(chartData);
  chartData = makeOthersSector(others_sector, chartData, colorFeed);

  return {
    source: chartData,
  };
};

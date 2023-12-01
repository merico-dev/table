import { quantile } from 'd3-array';
import _ from 'lodash';
import { AnyObject } from '~/types';
import { parseDataKey } from '~/utils';
import { IBoxplotChartConf, IBoxplotDataItem, TOutlierDataItem, TScatterDataItem } from '../type';

function calcBoxplotData(groupedData: Record<string, AnyObject[]>, columnKey: string) {
  const outliersData: TOutlierDataItem[] = [];
  const scatterData: TScatterDataItem[] = [];
  const boxplotData = Object.entries(groupedData).map(([name, data]) => {
    const numbers: number[] = data.map((d) => d[columnKey]).sort((a, b) => a - b);
    const q1 = quantile(numbers, 0.25) ?? 0;
    const median = quantile(numbers, 0.5) ?? 0;
    const q3 = quantile(numbers, 0.75) ?? 0;

    const IQR = q3 - q1;
    const minLimit = q1 - 1.5 * IQR;
    const maxLimit = q3 + 1.5 * IQR;

    const min = Math.max(numbers[0], minLimit);
    const max = Math.min(_.last(numbers) ?? 0, maxLimit);

    data
      .filter((d) => {
        const v = d[columnKey];
        return v < min || v > max;
      })
      .forEach((d) => outliersData.push([name, d[columnKey], d]));

    data
      .filter((d) => {
        const v = d[columnKey];
        return v >= min && v <= max;
      })
      .forEach((d) => scatterData.push([name, d[columnKey], d]));

    const boxplot: IBoxplotDataItem = {
      name,
      min,
      q1,
      median,
      q3,
      max,
    };

    return boxplot;
  });

  return {
    boxplotData,
    outliersData,
    scatterData,
  };
}

export function getDataset(conf: IBoxplotChartConf, data: TPanelData) {
  const { x_axis, y_axis } = conf;
  if (!x_axis.data_key || !y_axis.data_key) {
    return [];
  }
  const x = parseDataKey(x_axis.data_key);
  const y = parseDataKey(y_axis.data_key);
  if (x.queryID !== y.queryID) {
    throw new Error('Please use the same query for X & Y axis');
  }
  const grouped = _.groupBy(data[x.queryID], x.columnKey);
  const { boxplotData, outliersData, scatterData } = calcBoxplotData(grouped, y.columnKey);
  return [
    {
      source: boxplotData,
    },
    {
      source: outliersData,
    },
    {
      source: scatterData,
    },
  ];
}

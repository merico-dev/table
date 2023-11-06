import { quantile } from 'd3-array';
import _ from 'lodash';
import { AnyObject } from '~/types';
import { IBoxplotChartConf, IBoxplotDataItem, TOutlierDataItem } from '../type';
import { extractData, parseDataKey } from '~/utils/data';

function calcBoxplotData(groupedData: Record<string, AnyObject[]>, columnKey: string) {
  const ret = Object.entries(groupedData).map(([name, data]) => {
    const numbers: number[] = data.map((d) => d[columnKey]).sort((a, b) => a - b);
    const q1 = quantile(numbers, 0.25) ?? 0;
    const median = quantile(numbers, 0.5) ?? 0;
    const q3 = quantile(numbers, 0.75) ?? 0;

    const IQR = q3 - q1;
    const minLimit = q1 - 1.5 * IQR;
    const maxLimit = q3 + 1.5 * IQR;

    const min = Math.max(numbers[0], minLimit);
    const max = Math.min(_.last(numbers) ?? 0, maxLimit);

    const outliers: TOutlierDataItem[] = data
      .filter((d) => {
        const v = d[columnKey];
        return v < min || v > max;
      })
      .map((d) => [name, d[columnKey], d]);

    const outlierSet = new Set(outliers.map((o) => o[1]));

    const violinData: number[] = data
      .filter((d) => {
        const v = d[columnKey];
        return v >= min && v <= max;
      })
      .map((d) => d[columnKey]);

    const boxplot: IBoxplotDataItem = {
      name,
      min,
      q1,
      median,
      q3,
      max,
      outliers,
      outlierSet,
      violinData,
    };

    return boxplot;
  });

  return ret;
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
  const boxplotData = calcBoxplotData(grouped, y.columnKey);
  const outliersData = boxplotData.map((b) => b.outliers).flat();
  return [
    {
      source: boxplotData,
    },
    {
      source: outliersData,
    },
  ];
}

import { quantile } from 'd3-array';
import _ from 'lodash';
import { AnyObject } from '~/types';
import { IBoxplotChartConf, IBoxplotDataItem } from '../type';

function calcBoxplotData(groupedData: Record<string, AnyObject[]>, data_key: string) {
  const ret = Object.entries(groupedData).map(([name, data]) => {
    const numbers: number[] = data.map((d) => d[data_key]).sort((a, b) => a - b);
    const q1 = quantile(numbers, 0.25) ?? 0;
    const median = quantile(numbers, 0.5) ?? 0;
    const q3 = quantile(numbers, 0.75) ?? 0;

    const IQR = q3 - q1;
    const minLimit = q1 - 1.5 * IQR;
    const maxLimit = q3 + 1.5 * IQR;

    const min = Math.max(numbers[0], minLimit);
    const max = Math.min(_.last(numbers) ?? 0, maxLimit);
    const outliers = numbers.filter((n) => n < min || n > max).map((n) => [name, n]);
    return {
      name,
      min,
      q1,
      median,
      q3,
      max,
      outliers,
    } as IBoxplotDataItem;
  });
  return ret;
}
export function getDataset(conf: IBoxplotChartConf, data: TVizData) {
  const { x_axis, y_axis } = conf;
  const grouped = _.groupBy(data, x_axis.data_key);
  const boxplotData = calcBoxplotData(grouped, y_axis.data_key);
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

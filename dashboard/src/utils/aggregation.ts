import _ from 'lodash';
import { quantile } from 'd3-array';
import { AnyObject } from '~/types';

export type AggregationType =
  | {
      type: 'none' | 'sum' | 'mean' | 'median' | 'max' | 'min';
      config: Record<$TSFixMe, never>;
    }
  | {
      type: 'quantile';
      config: {
        p: number;
      };
    };
export const DefaultAggregation: AggregationType = {
  type: 'none',
  config: {},
};

function median(numbers: number[]) {
  const sorted = Array.from(numbers).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

function tryReadNumber(obj: AnyObject, key: string) {
  const value = obj[key];
  const num = Number(value);
  if (isFinite(num)) {
    return num;
  } else {
    return 0;
  }
}

export function aggregateValue(data: AnyObject[], data_field: string, aggregation: AggregationType) {
  try {
    const numbers = data.map((d) => tryReadNumber(d, data_field));
    switch (aggregation.type) {
      case 'sum':
        return _.sum(numbers);
      case 'mean':
        return _.mean(numbers);
      case 'median':
        return median(numbers);
      case 'max':
        return _.max(numbers) ?? 0;
      case 'min':
        return _.min(numbers) ?? 0;
      case 'quantile':
        return quantile(numbers, aggregation.config.p) ?? 0;
      default:
        return numbers;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

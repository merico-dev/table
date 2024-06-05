import { quantile } from 'd3-array';
import _ from 'lodash';
import * as math from 'mathjs';
import { extractData, extractFullQueryData } from './data';
import { functionUtils } from './function-utils';

export type TCustomAggregation = {
  type: 'custom';
  config: {
    func: string;
  };
  fallback: string;
};
export type TPickRecordAggregation = {
  type: 'pick_record';
  config: {
    method: 'first' | 'last';
  };
  fallback: string;
};
export type TSimpleAggregation = {
  type: 'none' | 'sum' | 'mean' | 'median' | 'max' | 'min' | 'CV' | 'std';
  config: Record<string, never>;
  fallback: string;
};
export type TQuantileAggregation = {
  type: 'quantile';
  config: {
    p: number;
  };
  fallback: string;
};

export const DefaultCustomAggregationFunc = [
  'function aggregation({ queryData }, utils) {',
  '    return "Aggregation Result";',
  '}',
].join('\n');

export type AggregationType = TSimpleAggregation | TQuantileAggregation | TPickRecordAggregation | TCustomAggregation;

export const DefaultAggregation: AggregationType = {
  type: 'none',
  config: {},
  fallback: '0',
};

function median(numbers: number[]) {
  const sorted = Array.from(numbers).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

function tryFormatAsNumber(value: any) {
  const num = Number(value);
  if (isFinite(num)) {
    return num;
  } else {
    return 0;
  }
}

function aggregateValueFromNumbers(numbers: number[], aggregation: AggregationType) {
  switch (aggregation.type) {
    case 'sum':
      return _.sum(numbers);
    case 'mean':
      return _.mean(numbers);
    case 'median':
      return median(numbers);
    case 'max':
      return _.max(numbers);
    case 'min':
      return _.min(numbers);
    case 'quantile':
      return quantile(numbers, aggregation.config.p);
    case 'CV':
      const std = math.std(...numbers);
      const mean = math.mean(...numbers);
      if (!mean) {
        return Number.NaN;
      }
      return std / mean;
    case 'std':
      return math.std(...numbers);
    default:
      return numbers;
  }
}
export function formatNumbersAndAggregateValue(possibleNumbers: Array<string | number>, aggregation: AggregationType) {
  const numbers = possibleNumbers.map(Number);
  const ret = aggregateValueFromNumbers(numbers, aggregation);
  if (typeof ret === 'number') {
    return Number.isFinite(ret) ? ret : aggregation.fallback;
  }

  return ret ?? aggregation.fallback;
}

function runCustomAggregation(data: TPanelData, data_field: string, aggregation: TCustomAggregation) {
  try {
    const queryData = extractFullQueryData(data, data_field);
    return new Function(`return ${aggregation.config.func}`)()({ queryData }, functionUtils);
  } catch (error) {
    console.error(error);
    return (error as any).message;
  }
}
function pickRecord(data: TPanelData, data_field: string, aggregation: TPickRecordAggregation) {
  try {
    const queryData = extractData(data, data_field);
    const { method } = aggregation.config;
    return _[method](queryData);
  } catch (error) {
    console.error(error);
    return aggregation.fallback;
  }
}

export function aggregateValue(data: TPanelData, data_field: string, aggregation: AggregationType) {
  try {
    if (aggregation.type === 'custom') {
      return runCustomAggregation(data, data_field, aggregation);
    }
    if (aggregation.type === 'pick_record') {
      return pickRecord(data, data_field, aggregation);
    }
    return formatNumbersAndAggregateValue(extractData(data, data_field), aggregation);
  } catch (error) {
    console.error(error);
    return null;
  }
}

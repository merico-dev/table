import numbro from 'numbro';
import { aggregateValue } from '../aggregation';
import { ITemplateVariable } from './types';

export function getNonStatsDataText(data: $TSFixMe) {
  if (data === null) {
    return 'null';
  }
  if (data === undefined) {
    return 'undefined';
  }
  if (Array.isArray(data)) {
    return `Array(${data.length})`;
  }
  return data.toString();
}

export function getAggregatedValue({ data_field, aggregation }: ITemplateVariable, data: Record<string, number>[]) {
  return aggregateValue(data, data_field, aggregation);
}

export function formatAggregatedValue({ formatter }: ITemplateVariable, value: number | string | number[] | null) {
  if (!['string', 'number'].includes(typeof value)) {
    return getNonStatsDataText(value);
  }
  try {
    return numbro(value).format(formatter);
  } catch (e) {
    console.error(e);
    return value;
  }
}

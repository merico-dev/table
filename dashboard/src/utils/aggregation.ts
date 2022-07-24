import _ from "lodash"

export type AggregationType = 'none' | 'sum' | 'mean' | 'median' | 'max' | 'min'

function median(numbers: number[]) {
  const sorted = Array.from(numbers).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

export function aggregateValue(data: Record<string, number>[], data_field: string, aggregation: AggregationType) {
  const numbers = data.map(d => d[data_field]);
  switch (aggregation) {
    case 'sum': return _.sum(numbers);
    case 'mean': return _.mean(numbers);
    case 'median': return median(numbers);
    case 'max': return _.max(numbers) ?? 0;
    case 'min': return _.min(numbers) ?? 0;
    default:
      return data[0]?.[data_field]
  }
}

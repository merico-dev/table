import { AnyObject } from '~/types';
import { Payload, Props } from './type';

function countData(data: number[]) {
  const group: AnyObject = {}; // value to count
  data.forEach((n) => {
    // const level = _.round(n, -1);
    const level = n;
    const count = group[level] ?? 0;
    group[level] = count + 1;
  });

  return group;
}

export function prepare({ boxplotDataset, api }: Props): Payload {
  const categoryIndex = api.value(0) as number;
  const source = boxplotDataset.source[categoryIndex];
  const { violinData, outliers } = source;

  const group = countData(violinData);
  const arr = Object.entries(group).sort((a, b) => Number(b[0]) - Number(a[0]));

  const outlierGroup = countData(outliers.map((o) => o[1]));
  return {
    api,
    arr,
    source,
    outlierGroup,
    categoryIndex,
  };
}

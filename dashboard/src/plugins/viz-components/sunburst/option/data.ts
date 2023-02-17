import { AnyObject } from '~/types';
import { ISunburstConf } from '../type';
import { arrayToTree } from './array-to-tree';
import { TreeItemIn } from './types';

export function buildSunburstData(conf: ISunburstConf, data: AnyObject[]) {
  const { label_key, value_key, group_key } = conf;
  const id_key = label_key;
  const chartData: TreeItemIn[] = data.map((d) => ({
    ...d,
    id: d[id_key],
    parent_id: d[group_key],
    name: d[label_key],
    value: d[value_key] ? Number(d[value_key]) : d[value_key],
  }));

  if (!group_key) {
    return chartData;
  }

  return arrayToTree(chartData);
}

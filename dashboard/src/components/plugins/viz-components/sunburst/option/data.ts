import { AnyObject } from '~/types';
import { ISunburstConf } from '../type';
import { arrayToTree } from './array-to-tree';
import { TreeItemIn } from './types';
import { parseDataKey } from '~/utils';

export function buildSunburstData(conf: ISunburstConf, data: TPanelData) {
  const { label_key, value_key, group_key } = conf;
  if (!label_key || !value_key) {
    return [];
  }
  const label = parseDataKey(label_key);
  const value = parseDataKey(value_key);
  const group = parseDataKey(group_key);

  const chartData: TreeItemIn[] = data[label.queryID].map((d) => ({
    ...d,
    id: d[label.columnKey],
    parent_id: d[group.columnKey],
    name: d[label.columnKey],
    value: d[value.columnKey] ? Number(d[value.columnKey]) : d[value.columnKey],
  }));

  if (!group_key) {
    return chartData;
  }

  return arrayToTree(chartData);
}

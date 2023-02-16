import _ from 'lodash';
import { arrayToTree, TreeItem } from 'performant-array-to-tree';
import { AnyObject } from '~/types';
import { ISunburstConf } from '../type';

function addTopLevel(nodes: TreeItem[], id_key: string, group_key: string): TreeItem[] {
  const knownIDSet = new Set(nodes.map((n) => n[id_key]));
  const grouped = _.groupBy(nodes, (n) => n[group_key]);
  const suppliments = Object.entries(grouped)
    .filter(([k]) => !knownIDSet.has(k))
    .map(([k, ns]) => ({
      id: k,
      name: k,
      value: ns.reduce((acc, n) => acc + n.value, 0),
      [group_key]: null,
    }));
  const ret = [...suppliments, ...nodes];
  return ret;
}

export function buildSunburstData(conf: ISunburstConf, data: AnyObject[]) {
  const { label_key, value_key, group_key } = conf;
  const id_key = label_key;
  const chartData = data.map((d) => ({
    ...d,
    id: d[id_key],
    name: d[label_key],
    value: Number(d[value_key]),
  }));
  if (!group_key) {
    return chartData;
  }

  const nodes = addTopLevel(chartData, id_key, group_key);
  const tree = arrayToTree(nodes, {
    id: 'id',
    parentId: group_key,
    childrenField: 'children',
    dataField: null,
  });

  return tree;
}

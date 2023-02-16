import _ from 'lodash';
import { TreeItemIn, TreeItemOut } from './types';

export function arrayToTree(nodes: TreeItemIn[]) {
  const outs: TreeItemOut[] = nodes.map((n) => ({ ...n, children: [] }));
  const keyed = _.keyBy(outs, (n) => n.id);
  const roots: TreeItemOut[] = [];

  outs.forEach((n) => {
    if (!n.parent_id || !keyed[n.parent_id]) {
      roots.push(n);
      return;
    }
    const p = keyed[n.parent_id];
    p.children.push(n);
  });

  return roots;
}

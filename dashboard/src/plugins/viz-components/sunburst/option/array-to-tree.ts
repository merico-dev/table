import _ from 'lodash';
import { TreeItemIn, TreeItemOut } from './types';

function addAbsents(nodes: TreeItemIn[]) {
  const parentIDs = new Set(nodes.map((n) => n.parent_id));
  const nodeIDs = new Set(nodes.map((n) => n.id));
  parentIDs.forEach((pID) => {
    if (pID === null || nodeIDs.has(pID)) {
      return;
    }
    nodes.push({
      id: pID,
      name: pID,
      parent_id: null,
    });
  });
  return nodes;
}

export function arrayToTree(nodes: TreeItemIn[]) {
  const outs: TreeItemOut[] = addAbsents(nodes).map((n) => ({ ...n, children: [] }));
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

import _ from 'lodash';
import { DashboardModelInstance } from '~/model';
import { makeEdges } from './edges';
import { makeNodes } from './nodes';
import { reposition } from './position';

export function makeNodesAndEdges(model: DashboardModelInstance) {
  const staticNodes = makeNodes(model);
  const staticNodeMap = _.keyBy(staticNodes, (n) => n.id);
  const { edges, edgeNodes } = makeEdges(model, staticNodeMap);

  const nodes = [...staticNodes, ...edgeNodes];
  const nodeMap = _.keyBy(nodes, (n) => n.id);

  const ret = {
    edges: _.uniqBy(edges, (e) => e.id),
    nodes,
    nodeMap,
  };

  return reposition(ret);
}

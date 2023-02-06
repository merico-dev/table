import { DashboardModelInstance } from '~/model';
import { makeEdges } from './edges';
import { makeNodes } from './nodes';
import { reposition } from './position';

export function makeNodesAndEdges(model: DashboardModelInstance) {
  const staticNodes = makeNodes(model);
  const { edges, edgeNodes } = makeEdges(model);

  const ret = {
    edges,
    nodes: [...staticNodes, ...edgeNodes],
  };

  return reposition(ret);
}

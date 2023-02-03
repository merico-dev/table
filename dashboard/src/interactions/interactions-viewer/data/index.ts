import { DashboardModelInstance } from '~/model';
import { makeEdges } from './edges';
import { makeNodes } from './nodes';

export function makeNodesAndEdges(model: DashboardModelInstance) {
  const staticNodes = makeNodes(model);
  const { edges, edgeNodes } = makeEdges(model);

  return {
    edges,
    nodes: [...staticNodes, ...edgeNodes],
  };
}

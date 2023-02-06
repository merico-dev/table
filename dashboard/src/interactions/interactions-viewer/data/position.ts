import _ from 'lodash';
import { Edge, Node } from 'reactflow';
import { PanelGapY, ViewPaddingT } from './metrics';
import { TFlowNode } from './types';

export function alignViews({
  nodeMap,
  nodes,
  edges,
}: {
  nodeMap: Record<string, TFlowNode>;
  nodes: TFlowNode[];
  edges: Edge[];
}) {
  nodes.forEach((n) => {
    if (['view-root', 'filter-root', 'open-link-root'].includes(n._node_type)) {
      // @ts-expect-error type of style
      const w = Number(n.style.width) ?? 0;
      n.position.x -= w / 2;
    }
  });
  edges.forEach((e) => {
    if (e.label !== 'Open View') {
      return;
    }
    const s = nodeMap[e.source];
    const t = nodeMap[e.target];
    if (s && t) {
      t.position.y = s.position.y + ViewPaddingT + PanelGapY;
    }
  });
}

export function reposition({ nodes, edges }: { nodes: TFlowNode[]; edges: Edge[] }) {
  const nodeMap = _.keyBy(nodes, (n) => n.id);
  alignViews({ nodeMap, nodes, edges });
  return {
    nodes,
    edges,
  };
}

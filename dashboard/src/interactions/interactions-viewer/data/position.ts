import { Edge, Position } from 'reactflow';
import { calc, ViewGapX, ViewGapY, ViewHeight, ViewWidth } from './metrics';
import { TFlowNode, TFlowNode_View } from './types';

interface ICommonProps {
  nodeMap: Record<string, TFlowNode>;
  nodes: TFlowNode[];
  edges: Edge[];
}

function fillViewProps({ nodeMap, nodes, edges }: ICommonProps) {
  edges
    .filter((e) => e.label === 'Open View')
    .forEach((e) => {
      const s = nodeMap[e.source];
      const t = nodeMap[e.target];
      if (!s || !t || !s.parentNode) {
        return;
      }
      const sp = nodeMap[s.parentNode];
      if (sp._node_type !== 'view-root' || t._node_type !== 'view-root') {
        return;
      }
      t._view_level += 1 + sp._view_level;
      sp._sub_view_ids.push(t.id);
    });
  nodes.sort((a, b) => {
    if (a._node_type === 'view-root' && b._node_type === 'view-root') {
      return a._view_level - b._view_level;
    }
    if (a._node_type !== 'view-root' && b._node_type !== 'view-root') {
      return 0;
    }
    return a._node_type === 'view-root' ? -1 : 1;
  });
}

function alignViews({ nodeMap, nodes, edges }: ICommonProps) {
  edges.forEach((e) => {
    if (e.label !== 'Open View') {
      return;
    }
    const s = nodeMap[e.source];
    const t = nodeMap[e.target] as TFlowNode_View;
    if (s && t && s.parentNode) {
      const sp = nodeMap[s.parentNode] as TFlowNode_View;
      const sy = s.position.y;
      const sh = Number(s.style!.height);
      const th = Number(t.style.height);
      const spx = sp.position.x;
      const spy = sp.position.y;
      const spw = Number(sp.style.width);
      const ids = sp._sub_view_ids;

      t.position.x = spx + spw + ViewGapX;

      const atLeft = sp._view_level === 0 && t._sub_view_ids.length === 0;
      if (atLeft) {
        s.sourcePosition = Position.Left;
        t.targetPosition = Position.Right;
        t.position.x *= -1;
      }

      if (ids.length < 2) {
        t.position.y = spy + sy - th / 2 + sh / 2;
        e.type = 'straight';
      } else {
        const index = ids.findIndex((i) => i === t.id);
        const newY = ids.reduce((acc, id, i) => {
          if (i >= index) {
            return acc;
          }
          const n = nodeMap[id] as TFlowNode_View;
          // skip right side
          if (atLeft && n._sub_view_ids.length > 0) {
            return acc;
          }
          // skip left side
          if (!atLeft && n._sub_view_ids.length === 0) {
            return acc;
          }
          const y = 0;
          const h = Number(n.style.height);
          return acc + y + h + ViewGapY;
        }, spy);
        t.position.y = newY;
      }
    }
  });
}

function positionStrayViews({ nodeMap, nodes, edges }: ICommonProps) {
  const sources = new Set();
  const targets = new Set();
  edges.forEach((e) => {
    sources.add(e.source);
    targets.add(e.target);
  });

  nodes
    .filter(
      (n) => n._node_type === 'view-root' && n.data.label !== 'Div:Main' && !sources.has(n.id) && !targets.has(n.id),
    )
    .forEach((n, i) => {
      n.position.x = calc(i, ViewWidth, ViewGapX);
      n.position.y = 0 - ViewHeight - ViewGapY;
    });
}

export function reposition({ nodeMap, nodes, edges }: ICommonProps) {
  const commonProps = { nodeMap, nodes, edges };
  fillViewProps(commonProps);
  alignViews(commonProps);
  positionStrayViews(commonProps);
  return {
    nodes,
    edges,
  };
}

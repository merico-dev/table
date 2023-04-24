import _ from 'lodash';
import { Edge, Position } from 'reactflow';
import { EViewComponentType } from '~/types';
import {
  calc,
  LaneGapX,
  ViewGapX,
  ViewGapY,
  ViewHeight,
  ViewPaddingB,
  ViewPaddingT,
  ViewPaddingX,
  ViewPaddingY,
  ViewWidth,
} from './metrics';
import { TFlowNode, TFlowNode_View } from './types';

interface ICommonProps {
  nodeMap: Record<string, TFlowNode>;
  nodes: TFlowNode[];
  edges: Edge[];
}

function wrapViewsInTabs({ nodeMap, nodes, edges }: ICommonProps) {
  nodes.forEach((n) => {
    if (n._node_type !== 'view-root' || n._view_type !== EViewComponentType.Tabs) {
      return;
    }
    n.sourcePosition = Position.Bottom;
    n.style.width = ViewWidth + ViewPaddingX * 2;
    n.style.height =
      ViewPaddingB +
      n._tab_view_ids.reduce((acc, curr) => {
        const view = nodeMap[curr];
        view.position.y = acc;
        view.position.x = ViewPaddingX;
        const h = view.style!.height as number;
        return acc + h + 20;
      }, ViewPaddingT);
  });
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
  const lanes: Record<number, number> = {};
  edges.forEach((e) => {
    if (e.label !== 'Open View') {
      return;
    }
    const s = nodeMap[e.source];
    const t = nodeMap[e.target] as TFlowNode_View;
    if (s && t && s.parentNode) {
      const sp = nodeMap[s.parentNode] as TFlowNode_View;
      const spx = sp.position.x;
      const th = Number(_.get(t, 'style.height', 0));
      const spw = Number(sp.style.width);

      t.position.x = spx + spw + LaneGapX;

      const atLeft = sp._view_level === 0 && t._sub_view_ids.length === 0;
      if (atLeft) {
        s.sourcePosition = Position.Left;
        t.targetPosition = Position.Right;
        t.position.x *= -1;
      }

      const x = t.position.x;
      const begin = _.get(lanes, x, 0);
      t.position.y = begin;
      lanes[x] = begin + th + ViewGapY;
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

  const strayNodes = nodes.filter((n) => {
    if (n._node_type !== 'view-root' || n.id === 'Main') {
      return false;
    }
    if (n.parentNode) {
      return false;
    }
    return !sources.has(n.id) && !targets.has(n.id);
  });
  strayNodes.forEach((n, i) => {
    n.position.x = calc(i, ViewWidth, ViewGapX);
    n.position.y = 0 - ViewHeight - ViewGapY;
  });
}

export function reposition({ nodeMap, nodes, edges }: ICommonProps) {
  const commonProps = { nodeMap, nodes, edges };
  positionStrayViews(commonProps);
  fillViewProps(commonProps);
  wrapViewsInTabs(commonProps);
  alignViews(commonProps);
  return {
    nodes,
    edges,
  };
}

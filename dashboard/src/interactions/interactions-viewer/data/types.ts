import { CSSProperties } from 'react';
import { Node } from 'reactflow';

export type TFlowNode_View = Node & {
  _node_type: 'view-root';
  _view_level: number;
  _sub_view_ids: string[];
  style: CSSProperties;
};

export type TFlowNode_Default = Node & {
  _node_type: 'filter-root' | 'filter' | 'open-link-root' | 'panel';
};
export type TFlowNode = TFlowNode_View | TFlowNode_Default;

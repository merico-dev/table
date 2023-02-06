import { Node } from 'reactflow';

export type TFlowNode = Node & {
  _node_type: 'view-root' | 'filter-root' | 'filter' | 'open-link-root' | 'panel';
};

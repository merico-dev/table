import { CSSProperties } from 'react';
import { Node } from 'reactflow';

type NodeExt =
  | {
      _node_type: 'filter-root' | 'filter' | 'open-link-root' | 'panel';
    }
  | {
      _node_type: 'view-root';
      _view_level: number;
      _sub_view_ids: string[];
      style: CSSProperties;
    };

export type TFlowNode = Node & NodeExt;

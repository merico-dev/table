import { Edge, MarkerType, Position } from 'reactflow';
import { DashboardModelInstance, ViewsModelInstance } from '~/model';
import { PanelModelInstance } from '~/model/views/view/panels';
import { AnyObject } from '~/types';
import { TFlowNode } from './types';

function makeEdgesFromPanels(views: ViewsModelInstance) {
  const edgeNodes: TFlowNode[] = [
    {
      id: 'OPEN_LINK',
      _node_type: 'open-link-root',
      data: { label: 'Open Link' },
      position: { x: 2000, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: { backgroundColor: 'rgba(0,120,255,0.2)', width: 100, height: 40 },
    },
  ];
  const edges: Edge[] = [];
  const panels: PanelModelInstance[] = [];
  views.current.forEach((v, i) => {
    const list = v.panels.list.filter((p) => '__INTERACTIONS' in p.viz.conf);
    panels.push(...list);
  });
  panels.forEach((p, pi) => {
    const { __INTERACTIONS, __OPERATIONS, __TRIGGERS } = p.viz.conf;
    Object.entries(__OPERATIONS).forEach(([k, v]) => {
      const { schemaRef, data } = v as AnyObject;
      const { config } = data as AnyObject;
      switch (schemaRef) {
        case 'builtin:op:open-link':
          let label = config.urlTemplate.substring(0, 20);
          if (config.urlTemplate.length >= 20) {
            label += '...';
          }
          edges.push({
            id: `OPERATION--${k}`,
            source: p.id,
            target: 'OPEN_LINK',
            label,
            style: {
              stroke: 'rgba(0,120,255,0.8)',
            },
          });
          return;
        case 'builtin:op:open_view':
          edges.push({
            id: `OPERATION--${k}`,
            source: p.id,
            target: config.viewID,
            label: 'Open View',
            style: {
              stroke: 'rgba(0,0,0,0.8)',
            },
            type: 'step',
          });
          return;
        case 'builtin:op:set_filter_values':
          Object.keys(config.dictionary).forEach((filterKey) => {
            edges.push({
              id: `OPERATION--${k}--${filterKey}`,
              source: p.id,
              target: filterKey,
              label: 'Set',
              type: 'step',
              labelStyle: { fill: 'black' },
              style: { stroke: 'orange' },
            });
          });
          return;
        case 'builtin:op:clear_filter_values':
          (config.filter_keys as string[]).forEach((filterKey) => {
            edges.push({
              id: `OPERATION--${k}--${filterKey}`,
              source: p.id,
              target: filterKey,
              label: 'Clear',
              labelStyle: { fill: 'red' },
              style: { stroke: 'orange' },
              type: 'step',
            });
          });
          return;
        default:
          return;
      }
    });
  });

  return { edges, edgeNodes };
}

export function makeEdges(model: DashboardModelInstance) {
  const { edges, edgeNodes } = makeEdgesFromPanels(model.views);
  return { edges, edgeNodes };
}

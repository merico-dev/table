import _ from 'lodash';
import { Edge, MarkerType, Position } from 'reactflow';
import { DashboardModelInstance, ViewsModelInstance } from '~/model';
import { PanelModelInstance } from '~/model/views/view/panels';
import { AnyObject } from '~/types';
import { TFlowNode } from './types';

function makeEdgesFromPanels(views: ViewsModelInstance, staticNodeMap: _.Dictionary<TFlowNode>) {
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
    const n = staticNodeMap[p.id];
    n.data.interactions = _.get(n, 'data.interactions', []);
    const { __INTERACTIONS, __OPERATIONS, __TRIGGERS } = p.viz.conf;
    Object.entries(__OPERATIONS).forEach(([k, v]) => {
      const { schemaRef, data } = v as AnyObject;
      const { config } = data as AnyObject;
      switch (schemaRef) {
        case 'builtin:op:open-link':
          let shortURLTemplate = config.urlTemplate.substring(0, 100);
          if (config.urlTemplate.length >= 20) {
            shortURLTemplate += '...';
          }
          n.type = 'interaction';
          n.data.interactions.push({
            schemaRef,
            urlTemplate: config.urlTemplate,
            shortURLTemplate,
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
          // n.type = 'interaction';
          // n.data.interactions.push({
          //   schemaRef,
          //   keys: Object.keys(config.dictionary),
          // });
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

export function makeEdges(model: DashboardModelInstance, staticNodeMap: _.Dictionary<TFlowNode>) {
  const { edges, edgeNodes } = makeEdgesFromPanels(model.views, staticNodeMap);
  return { edges, edgeNodes };
}

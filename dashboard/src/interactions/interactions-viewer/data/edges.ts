import _ from 'lodash';
import { Edge } from 'reactflow';
import { DashboardModelInstance, ViewsModelInstance } from '~/model';
import { PanelModelInstance } from '~/model/panels';
import { AnyObject } from '~/types';
import { TFlowNode } from './types';

function makeEdgesFromPanels(
  views: ViewsModelInstance,
  staticNodeMap: _.Dictionary<TFlowNode>,
  filterLabelMap: Record<string, string>,
) {
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
            type: 'default',
          });
          return;
        case 'builtin:op:set_filter_values':
          n.type = 'interaction';
          n.data.interactions.push({
            schemaRef,
            filters: Object.keys(config.dictionary).map((k) => ({ key: k, label: filterLabelMap[k] })),
          });
          return;
        case 'builtin:op:clear_filter_values':
          n.type = 'interaction';
          n.data.interactions.push({
            schemaRef,
            filters: (config.filter_keys as string[]).map((k) => ({ key: k, label: filterLabelMap[k] })),
          });
          return;
        default:
          return;
      }
    });
  });

  return edges;
}

export function makeEdges(model: DashboardModelInstance, staticNodeMap: _.Dictionary<TFlowNode>) {
  const filterLabelMap = model.filters.keyLabelMap;
  const edges = makeEdgesFromPanels(model.views, staticNodeMap, filterLabelMap);
  return { edges, edgeNodes: [] };
}

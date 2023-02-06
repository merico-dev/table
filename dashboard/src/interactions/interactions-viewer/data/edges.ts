import { MarkerType } from 'reactflow';
import { DashboardModelInstance, ViewsModelInstance } from '~/model';
import { PanelModelInstance } from '~/model/views/view/panels';
import { AnyObject } from '~/types';

function makeEdgesFromPanels(views: ViewsModelInstance) {
  const edgeNodes: any[] = [
    {
      id: 'OPEN_LINK',
      data: { label: 'Open Link' },
      position: { x: 0, y: 1000 },
      style: { backgroundColor: 'rgba(0,120,255,0.2)', width: 2000, height: 40 },
    },
  ];
  const edges: any[] = [];
  const panels: PanelModelInstance[] = [];
  views.current.forEach((v, i) => {
    const list = v.panels.list.filter((p) => '__INTERACTIONS' in p.viz.conf);
    panels.push(...list);
  });
  panels.forEach((p, pi) => {
    const { __INTERACTIONS, __OPERATIONS, __TRIGGERS } = p.viz.conf;
    console.log(__OPERATIONS);
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
            labelStyle: { color: 'blue' },
          });
          return;
        case 'builtin:op:open_view':
          edges.push({
            id: `OPERATION--${k}`,
            source: p.id,
            target: config.viewID,
            label: 'Open View',
          });
          return;
        case 'builtin:op:set_filter_values':
          Object.keys(config.dictionary).forEach((filterKey) => {
            edges.push({
              id: `OPERATION--${k}`,
              source: p.id,
              target: filterKey,
              label: 'Set',
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

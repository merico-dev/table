import { DashboardModelInstance, ViewsModelInstance } from '~/model';
import { PanelModelInstance } from '~/model/views/view/panels';
import { AnyObject } from '~/types';

function makeEdgesFromPanels(views: ViewsModelInstance) {
  const edgeNodes: any[] = [];
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
          console.log(config);
          edgeNodes.push({
            id: k,
            data: { label: `Visit: ${config.urlTemplate}` },
            position: { x: pi * 200, y: -100 },
            style: { minWidth: 200, width: 'auto', maxWidth: 600, textAlign: 'left' },
          });
          edges.push({
            // id: `OPERATION--${k}`,
            source: p.id,
            target: k,
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

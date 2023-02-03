import { DashboardModelInstance, FiltersModelInstance, ViewsModelInstance } from '~/model';
import { AnyObject } from '~/types';

const ViewPaddingX = 25;
const ViewHeight = 150;
const ViewGap = 150;

const PanelWidth = 300;
const PanelHeight = 50;
const PanelGapX = 25;
const PanelGapY = 25;

function calc(index: number, unit: number, gap: number) {
  const ret = index * unit + index * gap;
  return ret;
}

function calcTotal(count: number, unit: number, gap: number) {
  const ret = count * unit + (count - 1) * gap;
  return ret;
}

function makeViewNodes(views: ViewsModelInstance) {
  const panelNodes: any[] = [];
  const viewNodes = views.current.map((v, i) => {
    v.panels.list.forEach((p, pi) => {
      const x = calc(pi, PanelWidth, PanelGapX) + ViewPaddingX;
      const label = `Panel:${p.title ? p.title : 'Untitled'}`;
      panelNodes.push({
        id: p.id,
        parentNode: v.id,
        data: { label },
        position: { x, y: 50 },
        style: { width: PanelWidth, height: PanelHeight },
      });
    });

    const y = calc(i, ViewHeight, ViewGap);
    const width = calcTotal(v.panels.list.length, PanelWidth, PanelGapX) + ViewPaddingX * 2;
    return {
      id: v.id,
      data: { label: `View:${v.name}` },
      position: { x: 50, y },
      className: 'light',
      style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width, height: ViewHeight },
    };
  });

  return viewNodes.concat(panelNodes);
}

function makeFilterNodes(filters: FiltersModelInstance) {
  return [];
}

export function makeNodes(model: DashboardModelInstance) {
  const viewNodes = makeViewNodes(model.views);
  const filterNodes = makeFilterNodes(model.filters);
  return [...viewNodes, ...filterNodes];
}

import { DashboardModelInstance, FiltersModelInstance, ViewsModelInstance } from '~/model';
import { AnyObject } from '~/types';
import { OpenLink } from '../../operation/operations/open-link';

const ViewPaddingX = 25;
const ViewPaddingY = 25;
const ViewWidth = 350;
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

function makePanelNodes(views: ViewsModelInstance) {
  const panelNodes: any[] = [];
  views.current.forEach((v, i) => {
    v.panels.list.forEach((p, pi) => {
      const y = calc(pi, PanelHeight, PanelGapY) + ViewPaddingY;
      const label = `Panel:${p.title}`;
      panelNodes.push({
        id: p.id,
        parentNode: v.id,
        data: { label },
        position: { x: ViewPaddingX, y },
        style: { width: PanelWidth, height: PanelHeight },
      });
    });
  });

  return panelNodes;
}

function makeViewNodes(views: ViewsModelInstance) {
  const viewNodes = views.current.map((v, i) => {
    const x = calc(i, ViewWidth, ViewGap);
    // const y = calc(i, ViewHeight, ViewGap);
    const height = calcTotal(v.panels.list.length, PanelHeight, PanelGapY) + ViewPaddingY * 2;
    return {
      id: v.id,
      data: { label: `View:${v.name}` },
      position: { x, y: 0 },
      className: 'light',
      style: {
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        width: ViewWidth,
        height,
      },
    };
  });

  return viewNodes;
}

function makeFilterNodes(filters: FiltersModelInstance) {
  return [];
}

export function makeNodes(model: DashboardModelInstance) {
  const viewNodes = makeViewNodes(model.views);
  const panelNodes = makePanelNodes(model.views);
  const filterNodes = makeFilterNodes(model.filters);
  return [...viewNodes, ...panelNodes, ...filterNodes];
}

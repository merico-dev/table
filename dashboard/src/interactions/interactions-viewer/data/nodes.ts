import { DashboardModelInstance, FiltersModelInstance, ViewsModelInstance } from '~/model';
import { AnyObject, EViewComponentType } from '~/types';
import { OpenLink } from '../../operation/operations/open-link';

const FilterWidth = 200;
const FilterHeight = 40;
const FilterPaddingT = 40;
const FilterPaddingB = 25;
const FilterGap = 25;

const ViewPaddingX = 25;
const ViewPaddingT = 40;
const ViewPaddingB = 25;
const ViewPaddingY = ViewPaddingT + ViewPaddingB;
const ViewWidth = 350;
const ViewHeight = 150;
const ViewGap = 150;

const PanelWidth = 300;
const PanelHeight = 40;
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
      const y = calc(pi, PanelHeight, PanelGapY) + ViewPaddingT;
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

const ViewTypeName = {
  [EViewComponentType.Division]: 'Div',
  [EViewComponentType.Modal]: 'Modal',
};
const ViewBackground = {
  [EViewComponentType.Division]: 'rgba(255, 0, 0, 0.2)',
  [EViewComponentType.Modal]: 'rgba(0, 0, 0, 0.2)',
};

function makeViewNodes(views: ViewsModelInstance) {
  const viewNodes = views.current.map((v, i) => {
    const x = calc(i, ViewWidth, ViewGap);
    // const y = calc(i, ViewHeight, ViewGap);
    const height = calcTotal(v.panels.list.length, PanelHeight, PanelGapY) + ViewPaddingT + ViewPaddingB;
    return {
      id: v.id,
      data: { label: `${ViewTypeName[v.type]}:${v.name}` },
      position: { x, y: 0 },
      className: 'light',
      style: {
        backgroundColor: ViewBackground[v.type],
        width: ViewWidth,
        height,
      },
    };
  });

  return viewNodes;
}

function makeFilterNodes(filters: FiltersModelInstance) {
  const filterNodes: any[] = [];
  filterNodes.push({
    id: 'FILTER',
    data: { label: 'Filters' },
    position: { x: 0, y: -300 },
    className: 'light',
    style: {
      backgroundColor: 'rgba(255, 128, 0, 0.2)',
      width: calcTotal(filters.current.length, FilterWidth, FilterGap) + FilterGap * 2,
      height: FilterHeight + FilterPaddingT + FilterPaddingB,
    },
  });
  filters.current.forEach((f, i) => {
    const x = calc(i, FilterWidth, FilterGap) + FilterGap;
    filterNodes.push({
      id: f.key,
      parentNode: 'FILTER',
      data: { label: f.label },
      position: { x, y: FilterPaddingT },
      style: {
        width: FilterWidth,
        height: FilterHeight,
      },
    });
  });

  return filterNodes;
}

export function makeNodes(model: DashboardModelInstance) {
  const viewNodes = makeViewNodes(model.views);
  const panelNodes = makePanelNodes(model.views);
  const filterNodes = makeFilterNodes(model.filters);
  return [...viewNodes, ...panelNodes, ...filterNodes];
}

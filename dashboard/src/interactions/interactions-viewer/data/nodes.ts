import { Position } from 'reactflow';
import { DashboardModelInstance, FiltersModelInstance, ViewsModelInstance } from '~/model';
import { EViewComponentType } from '~/types';
import {
  calc,
  calcTotal,
  FilterGap,
  FilterHeight,
  FilterPaddingB,
  FilterPaddingL,
  FilterPaddingR,
  FilterPaddingT,
  FilterWidth,
  PanelGapY,
  PanelHeight,
  PanelWidth,
  ViewPaddingB,
  ViewPaddingT,
  ViewPaddingX,
  ViewWidth,
} from './metrics';
import { TFlowNode } from './types';

function makePanelNodes(views: ViewsModelInstance) {
  const panelNodes: TFlowNode[] = [];
  views.current.forEach((v, i) => {
    v.panels.list.forEach((p, pi) => {
      const y = calc(pi, PanelHeight, PanelGapY) + ViewPaddingT;
      const label = `Panel:${p.title}`;
      panelNodes.push({
        id: p.id,
        _node_type: 'panel',
        parentNode: v.id,
        data: { label },
        position: { x: ViewPaddingX, y },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
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
  const viewNodes: TFlowNode[] = views.current.map((v, i) => {
    const height = calcTotal(v.panels.list.length, PanelHeight, PanelGapY) + ViewPaddingT + ViewPaddingB;
    return {
      id: v.id,
      _node_type: 'view-root',
      _view_level: 0,
      _sub_view_ids: [],
      data: { label: `${ViewTypeName[v.type]}:${v.name}` },
      position: { x: 0, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
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
  const filterNodes: TFlowNode[] = [];
  const height = calcTotal(filters.current.length, FilterHeight, FilterGap) + FilterPaddingT + FilterPaddingB;
  filterNodes.push({
    id: 'FILTER',
    _node_type: 'filter-root',
    data: { label: 'Filters' },
    position: { x: 2000, y: 100 },
    className: 'light',
    style: {
      backgroundColor: 'rgba(255, 128, 0, 0.2)',
      width: FilterWidth + FilterPaddingL + FilterPaddingR,
      height,
    },
  });
  filters.inOrder.map((f, i) => {
    const y = calc(i, FilterHeight, FilterGap) + FilterPaddingT;
    filterNodes.push({
      id: f.key,
      _node_type: 'filter',
      parentNode: 'FILTER',
      data: { label: f.label },
      position: { x: FilterPaddingL, y },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
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

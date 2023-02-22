import { Position } from 'reactflow';
import { DashboardModelInstance, FiltersModelInstance, ViewsModelInstance } from '~/model';
import { IViewConfigModel_Tabs, ViewConfigModel_Tabs_Tab_Instance } from '~/model/views/view/tabs';
import { EViewComponentType, ViewComponentTypeBackground } from '~/types';
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
      const label = p.title.trim() ? `${p.title}` : p.viz.type;
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
  [EViewComponentType.Tabs]: 'Tabs',
};
const ViewBackground = ViewComponentTypeBackground;

function makeViewNodes(views: ViewsModelInstance) {
  const viewNodes: TFlowNode[] = views.current.map((v, i) => {
    const height = calcTotal(v.panels.list.length, PanelHeight, PanelGapY) + ViewPaddingT + ViewPaddingB;
    let _tab_view_ids: string[] = [];
    if (v.type === EViewComponentType.Tabs) {
      const config = v.config as IViewConfigModel_Tabs;
      _tab_view_ids = config.tabs.map((t) => t.view_id);
    }
    return {
      id: v.id,
      _node_type: 'view-root',
      _view_type: v.type,
      _view_level: 0,
      _sub_view_ids: [],
      _tab_view_ids,
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

export function makeNodes(model: DashboardModelInstance) {
  const viewNodes = makeViewNodes(model.views);
  const panelNodes = makePanelNodes(model.views);
  return [...viewNodes, ...panelNodes];
}

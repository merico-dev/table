import _ from 'lodash';
import { Position } from 'reactflow';
import { DashboardModelInstance, FiltersModelInstance, PanelModelInstance, ViewsModelInstance } from '~/model';
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

function makePanelNodes(views: ViewsModelInstance, panels: PanelModelInstance[]) {
  const panelsMap = _.keyBy(panels, (p) => p.id);
  const panelNodes: TFlowNode[] = [];
  views.current.forEach((v, i) => {
    v.panelIDs.forEach((pid, pi) => {
      const y = calc(pi, PanelHeight, PanelGapY) + ViewPaddingT;

      const p = panelsMap[pid];
      if (!p) {
        panelNodes.push({
          id: pid,
          _node_type: 'panel',
          parentNode: v.id,
          data: { label: `!: ${pid}` },
          position: { x: ViewPaddingX, y },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          style: { width: PanelWidth, height: PanelHeight },
        });
        return;
      }

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
    const height = calcTotal(v.panelIDs.length, PanelHeight, PanelGapY) + ViewPaddingT + ViewPaddingB;
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

function addParentToTabView(viewNodes: TFlowNode[]) {
  const map = _.keyBy(viewNodes, (n) => n.id);
  viewNodes.forEach((n) => {
    if (n._node_type !== 'view-root' || n._view_type !== EViewComponentType.Tabs) {
      return;
    }
    n._tab_view_ids.forEach((id) => {
      map[id].parentNode = n.id;
    });
  });
}

export function makeNodes(model: DashboardModelInstance) {
  const viewNodes = makeViewNodes(model.views);
  addParentToTabView(viewNodes);
  const panelNodes = makePanelNodes(model.views, model.panels.list);
  return [...viewNodes, ...panelNodes];
}

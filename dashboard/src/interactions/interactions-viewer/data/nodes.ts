import _ from 'lodash';
import { Position } from 'reactflow';
import { ContentRenderModelInstance } from '~/dashboard-render/model/content';
import {
  EViewComponentType,
  PanelRenderModelInstance,
  ViewTabsConfigInstance,
  ViewsRenderModelInstance,
} from '~/model';
import { ViewComponentTypeBackground } from '~/types';
import {
  PanelGapY,
  PanelHeight,
  PanelWidth,
  ViewPaddingB,
  ViewPaddingT,
  ViewPaddingX,
  ViewWidth,
  calc,
  calcTotal,
} from './metrics';
import { TFlowNode } from './types';

function makePanelNodes(views: ViewsRenderModelInstance, panels: PanelRenderModelInstance[]) {
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

      const label = p.name;
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

function makeViewNodes(views: ViewsRenderModelInstance) {
  const viewNodes: TFlowNode[] = views.current.map((v, i) => {
    const height = calcTotal(v.panelIDs.length, PanelHeight, PanelGapY) + ViewPaddingT + ViewPaddingB;
    let _tab_view_ids: string[] = [];
    if (v.type === EViewComponentType.Tabs) {
      const config = v.config as ViewTabsConfigInstance;
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

export function makeNodes(model: ContentRenderModelInstance) {
  const viewNodes = makeViewNodes(model.views);
  addParentToTabView(viewNodes);
  const panelNodes = makePanelNodes(model.views, model.panels.list);
  return [...viewNodes, ...panelNodes];
}

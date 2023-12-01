import { AnyObject } from '~/types/utils';
import { ITemplateVariable } from '~/utils';

import { EViewComponentType, FilterMetaSnapshotOut, QueryMetaSnapshotIn, SQLSnippetMetaSnapshotIn } from '~/model';

export interface IVizConfig {
  type: string;
  conf: AnyObject;
}

interface IDashboardPanelStyle {
  border: {
    enabled: boolean;
  };
}

export interface IDashboardPanel {
  id: string;
  name: string;
  title: {
    show: boolean;
  };
  description: string;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
    moved?: boolean;
    static?: boolean;
  };
  queryIDs: string[];
  viz: IVizConfig;
  style: IDashboardPanelStyle;
  variables: ITemplateVariable[];
}

export enum DashboardMode {
  Use = 'use',
  Edit = 'edit',
}

export interface IDashboardDefinition {
  sqlSnippets: SQLSnippetMetaSnapshotIn[];
  queries: QueryMetaSnapshotIn[];
  mock_context: Record<string, $TSFixMe>;
}

export const ViewComponentTypeName = {
  [EViewComponentType.Division]: 'Division',
  [EViewComponentType.Tabs]: 'Tabs',
  [EViewComponentType.Modal]: 'Modal',
};

export const ViewComponentTypeBackground = {
  [EViewComponentType.Division]: 'rgba(255, 0, 0, 0.2)',
  [EViewComponentType.Modal]: 'rgba(0, 0, 0, 0.2)',
  [EViewComponentType.Tabs]: 'rgba(255, 200, 100, 0.4)',
};

export const ViewComponentTypeColor = {
  [EViewComponentType.Division]: '#ff4000',
  [EViewComponentType.Modal]: '#000',
  [EViewComponentType.Tabs]: '#ffad18',
};

export interface IDashboardView {
  id: string;
  name: string;
  type: EViewComponentType;
  config: Record<string, any>;
  panelIDs: string[];
}

export interface IDashboard {
  id: string;
  name: string;
  group: string;
  content_id: string;
}

export interface TDashboardContent {
  definition: IDashboardDefinition;
  views: IDashboardView[];
  panels: IDashboardPanel[];
  filters: FilterMetaSnapshotOut[];
  version: string;
}

export type DashboardContentDBType = {
  id: string;
  dashboard_id: string;
  name: string;
  content: TDashboardContent | null;
  create_time: string;
  update_time: string;
};

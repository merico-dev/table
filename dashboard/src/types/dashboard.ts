import { AnyObject } from '~/types/utils';
import { ITemplateVariable } from '~/utils/template';
import { FilterModelSnapshotOut } from '../model';
import { QueryModelSnapshotIn } from '../model/queries';
import { SQLSnippetModelSnapshotIn } from '../model/sql-snippets';

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
  title: string;
  description: string;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
    moved?: boolean;
    static?: boolean;
  };
  queryID: string;
  viz: IVizConfig;
  style: IDashboardPanelStyle;
  variables: ITemplateVariable[];
}

export enum DashboardMode {
  Use = 'use',
  Edit = 'edit',
}

export interface IDashboardDefinition {
  sqlSnippets: SQLSnippetModelSnapshotIn[];
  queries: QueryModelSnapshotIn[];
  mock_context: Record<string, $TSFixMe>;
}

export enum EViewComponentType {
  Division = 'div',
  Modal = 'modal',
  Tabs = 'tabs',
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
  panels: IDashboardPanel[];
}

export interface IDashboard {
  id: string;
  name: string;
  group: string;
  definition: IDashboardDefinition;
  views: IDashboardView[];
  filters: FilterModelSnapshotOut[];
  version: string;
}

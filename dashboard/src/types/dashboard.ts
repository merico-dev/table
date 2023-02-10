import { AnyObject } from '~/types/utils';
import { ITemplateVariable } from '~/utils/template';
import { FilterModelInstance } from '../model';
import { QueryModelSnapshotIn } from '../model/queries';
import { SQLSnippetModelInstance } from '../model/sql-snippets';

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
  sqlSnippets: SQLSnippetModelInstance[];
  queries: QueryModelSnapshotIn[];
  mock_context: Record<string, $TSFixMe>;
}

export enum EViewComponentType {
  Division = 'div',
  Modal = 'modal',
  Tabs = 'tabs',
}

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
  filters: FilterModelInstance[];
  variables: ITemplateVariable[];
  version: string;
}

import { AnyObject } from '~/types/utils';
import { FilterModelInstance } from '../model';
import { QueryModelInstance } from '../model/queries';
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
}

export enum DashboardMode {
  Use = 'use',
  Edit = 'edit',
}

export interface IDashboardDefinition {
  sqlSnippets: SQLSnippetModelInstance[];
  queries: QueryModelInstance[];
}

export enum EViewComponentType {
  Division = 'div',
  Modal = 'modal',
  // Tabs = 'tabs',
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
  definition: IDashboardDefinition;
  views: IDashboardView[];
  filters: FilterModelInstance[];
  version: string;
}

export interface IDashboardConfig {
  apiBaseURL: string;
}

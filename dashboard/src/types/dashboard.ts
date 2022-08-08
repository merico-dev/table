import { IDashboardFilter } from './filter';

export interface IVizConfig {
  type: string;
  conf: Record<string, any>;
}

export interface IQuery {
  type: 'postgresql';
  key: string;
  sql: string;
  id: string;
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
}

export enum DashboardMode {
  Use = 'use',
  Layout = 'layout',
  Edit = 'edit',
}

export interface ISQLSnippet {
  key: string;
  value: string;
}

export interface IDashboardDefinition {
  sqlSnippets: ISQLSnippet[];
  queries: IQuery[];
}

export interface IDashboard {
  id: string;
  name: string;
  definition: IDashboardDefinition;
  panels: IDashboardPanel[];
  filters: IDashboardFilter[];
}

export interface IDashboardConfig {
  apiBaseURL: string;
}

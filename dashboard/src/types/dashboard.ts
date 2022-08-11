import { FilterModelInstance } from '../model';
import { QueryModelInstance } from '../model/queries';

export interface IVizConfig {
  type: string;
  conf: Record<string, any>;
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
  queries: QueryModelInstance[];
}

export interface IDashboard {
  id: string;
  name: string;
  definition: IDashboardDefinition;
  panels: IDashboardPanel[];
  filters: FilterModelInstance[];
}

export interface IDashboardConfig {
  apiBaseURL: string;
}

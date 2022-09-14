import { AnyObject } from '~/types/utils';
import { FilterModelInstance } from '../model';
import { QueryModelInstance } from '../model/queries';
import { SQLSnippetModelInstance } from '../model/sql-snippets';

export interface IVizConfig {
  type: string;
  conf: AnyObject;
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
  Edit = 'edit',
}

export interface IDashboardDefinition {
  sqlSnippets: SQLSnippetModelInstance[];
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

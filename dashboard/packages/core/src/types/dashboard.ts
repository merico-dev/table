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
    },
    sql: string;
    viz: IVizConfig;
}

export enum DashboardMode {
  Use = 'use',
  Edit = 'edit',
}

export interface ISQLSnippet {
  key: string;
  value: string;
}

export interface IDashboardDefinition {
  sql_snippets: ISQLSnippet[];
}

export interface IDashboard {
  id: string;
  name: string;
  definition: IDashboardDefinition;
  panels: IDashboardPanel[];
}
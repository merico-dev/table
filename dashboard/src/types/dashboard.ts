export interface IVizConfig {
  type: string;
  conf: Record<string, any>;
}

export interface IDashboardItem {
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
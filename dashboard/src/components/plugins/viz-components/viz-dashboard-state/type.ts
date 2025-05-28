export interface IVizDashboardStateConf {
  all: boolean;
  keys: string[];
}

export const DEFAULT_CONFIG: IVizDashboardStateConf = {
  all: true,
  keys: [],
};

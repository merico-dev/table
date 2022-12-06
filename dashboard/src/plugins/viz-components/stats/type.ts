export const DEFAULT_CONFIG: IVizStatsConf = {
  align: 'center',
  template: 'The variable ${value} is defined in Variables section',
};

export interface IVizStatsConf {
  align: 'center';
  template: string;
}

export interface IVizStatsConf {
  template: string;
  vertical_align: 'top' | 'center' | 'bottom';
  horizontal_align: 'left' | 'center' | 'right';
}
export const DEFAULT_CONFIG: IVizStatsConf = {
  template: 'The variable ${value} is defined in Variables section',
  vertical_align: 'center',
  horizontal_align: 'left',
};

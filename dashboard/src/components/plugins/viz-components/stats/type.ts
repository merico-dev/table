import { HorizontalAlign, VerticalAlign } from '../../editor-components';

export interface IVizStatsConf {
  template: string;
  vertical_align: VerticalAlign;
  horizontal_align: HorizontalAlign;
}
export const DEFAULT_CONFIG: IVizStatsConf = {
  template: 'The variable ${value} is defined in Variables section',
  vertical_align: 'center',
  horizontal_align: 'left',
};

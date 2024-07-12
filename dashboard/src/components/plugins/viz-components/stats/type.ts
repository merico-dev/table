import { VerticalAlign } from '../../editor-components';

export interface IVizStatsConf {
  content: string;
  vertical_align: VerticalAlign;
}
export const DEFAULT_CONFIG: IVizStatsConf = {
  content: 'Use double curly brackets to wrap js code: {{ new Date().getTime() }}',
  vertical_align: 'center',
};

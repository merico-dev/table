import { HorizontalAlign } from '../../editor-components';

export const DEFAULT_TEXT_FUNC_CONTENT = [
  'function text({ data, variables, filters, context}) {',
  '    // your code goes here',
  '    return "text"',
  '}',
].join('\n');

export interface IVizTextConf {
  func_content: string;
  horizontal_align: HorizontalAlign;
  font_size: string;
  font_weight: string;
}

export const DEFAULT_CONFIG: IVizTextConf = {
  func_content: DEFAULT_TEXT_FUNC_CONTENT,
  horizontal_align: 'left',
  font_size: '14px',
  font_weight: 'normal',
};

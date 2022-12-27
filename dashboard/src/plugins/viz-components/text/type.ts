export const DEFAULT_TEXT_FUNC_CONTENT = [
  'function text({ data, variables, filters, context}) {',
  '    // your code goes here',
  '    return "text"',
  '}',
].join('\n');

export interface IVizTextConf {
  func_content: string;
  horizontal_align: 'left' | 'center' | 'right';
}

export const DEFAULT_CONFIG: IVizTextConf = {
  func_content: DEFAULT_TEXT_FUNC_CONTENT,
  horizontal_align: 'left',
};

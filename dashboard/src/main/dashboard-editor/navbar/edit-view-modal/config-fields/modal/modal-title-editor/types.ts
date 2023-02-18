export interface ICustomModalTitle {
  enabled: boolean;
  func_content: string;
}

export const DEFAULT_CUSTOM_MODAL_TITLE = {
  enabled: false,
  func_content: ['function text({ filters, context}) {', '    // your code goes here', '    return "text"', '}'].join(
    '\n',
  ),
};

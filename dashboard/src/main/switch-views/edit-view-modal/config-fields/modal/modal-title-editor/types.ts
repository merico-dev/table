export interface ICustomModalTitle {
  enabled: boolean;
  func_content: string;
}

export const DEFAULT_CUSTOM_MODAL_TITLE = {
  enabled: false,
  func_content: ['function label(value, index) {', '    // your code goes here', '    // return value', '}'].join('\n'),
};

export interface IXAxisLabelFormatter {
  enabled: boolean;
  func_content: string;
}

export const DEFAULT_X_AXIS_LABEL_FORMATTER = {
  enabled: false,
  func_content: ['function label(value, index) {', '    // your code goes here', '    // return value', '}'].join('\n'),
};

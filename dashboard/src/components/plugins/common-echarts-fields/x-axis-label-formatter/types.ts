export interface IXAxisLabelFormatter {
  enabled: boolean;
  func_content: string;
}

// TODO: deprecate this
export const DEFAULT_X_AXIS_LABEL_FORMATTER: IXAxisLabelFormatter = {
  enabled: false,
  func_content: ['function label(value, index) {', '    // your code goes here', '    // return value', '}'].join('\n'),
};

export function getDefaultXAxisLabelFormatter(): IXAxisLabelFormatter {
  return {
    enabled: false,
    func_content: ['function label(value, index) {', '    // your code goes here', '    // return value', '}'].join(
      '\n',
    ),
  };
}

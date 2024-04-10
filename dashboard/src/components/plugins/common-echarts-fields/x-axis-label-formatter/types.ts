export interface IXAxisLabelFormatter {
  enabled: boolean;
  func_content: string;
}

export function getDefaultXAxisLabelFormatter(): IXAxisLabelFormatter {
  return {
    enabled: false,
    func_content: ['function label(value, index) {', '    // your code goes here', '    // return value', '}'].join(
      '\n',
    ),
  };
}

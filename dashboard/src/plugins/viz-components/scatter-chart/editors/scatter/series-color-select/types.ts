import { random } from 'chroma-js';

export type TSeriesColor_Static = {
  type: 'static';
  color: string;
};

export type TSeriesColor_Dynamic = {
  type: 'dynamic';
  func_content: string;
};

export type TSeriesColor = TSeriesColor_Static | TSeriesColor_Dynamic;

export const DEFAULT_SERIES_COLOR = {
  static: {
    type: 'static',
    color: random().css(),
  } as TSeriesColor_Static,
  dynamic: {
    type: 'dynamic',
    func_content: [
      'function getColor({ rowData, params, variables }, { lodash, interpolate }) {',
      '    // your code goes here',
      '    // return "blue"',
      '}',
    ].join('\n'),
  } as TSeriesColor_Dynamic,
};

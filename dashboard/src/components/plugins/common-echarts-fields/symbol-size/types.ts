export type SymbolSize_Static = {
  type: 'static';
  size: number;
};

export type SymbolSize_Dynamic = {
  type: 'dynamic';
  func_content: string;
};

export type SymbolSize = SymbolSize_Static | SymbolSize_Dynamic;

export const DEFAULT_SCATTER_SIZE = {
  static: {
    type: 'static',
    size: 10,
  } as SymbolSize_Static,
  dynamic: {
    type: 'dynamic',
    func_content: [
      'function getSize({ rowData, params, variables }, { lodash, interpolate }) {',
      '    // your code goes here',
      '    // return 10',
      '}',
    ].join('\n'),
  } as SymbolSize_Dynamic,
};

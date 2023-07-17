export type TNumberOrDynamic_Static = {
  type: 'static';
  value: number | '';
};

export type TNumberOrDynamic_Dynamic = {
  type: 'dynamic';
  value: string;
};

export type TNumberOrDynamic = TNumberOrDynamic_Static | TNumberOrDynamic_Dynamic;

export const DEFAULT_VALUE = {
  static: {
    type: 'static',
    value: 10,
  } as TNumberOrDynamic_Static,
  dynamic: {
    type: 'dynamic',
    value: [
      'function getSize({ variables }, { lodash, interpolate }) {',
      '    // your code goes here',
      '    // return 100;',
      '}',
    ].join('\n'),
  } as TNumberOrDynamic_Dynamic,
};

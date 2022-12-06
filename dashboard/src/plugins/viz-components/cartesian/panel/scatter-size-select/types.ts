export type TScatterSize_Static = {
  type: 'static';
  size: number;
};

export type TScatterSize_Interpolation = {
  type: 'interpolation';
  data_key: string;
  size_range: number[];
  value_range: number[];
};

export type TScatterSize = TScatterSize_Static | TScatterSize_Interpolation;

export const DEFAULT_SCATTER_SIZE = {
  static: {
    type: 'static',
    size: 10,
  } as TScatterSize_Static,
  interpolation: {
    type: 'interpolation',
    data_key: '',
    size_range: [],
    value_range: [],
  } as TScatterSize_Interpolation,
};

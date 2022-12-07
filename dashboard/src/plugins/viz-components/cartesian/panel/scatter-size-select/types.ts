export type TScatterSize_Static = {
  type: 'static';
  size: number;
};

export type TSizeInterpolationPoint = {
  size: number;
  value: number;
};

export type TScatterSize_Interpolation = {
  type: 'interpolation';
  data_key: string;
  points: TSizeInterpolationPoint[];
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
    points: [],
  } as TScatterSize_Interpolation,
};

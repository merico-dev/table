export type TScatterSize_Static = {
  type: 'static';
  size: number;
};

export type TScatterSize_Dynamic = {
  type: 'dynamic';
  func_content: string;
};

export type TScatterSize = TScatterSize_Static | TScatterSize_Dynamic;

export const DEFAULT_SCATTER_SIZE = {
  static: {
    type: 'static',
    size: 10,
  } as TScatterSize_Static,
  dynamic: {
    type: 'dynamic',
    func_content: 'return 10',
  } as TScatterSize_Dynamic,
};

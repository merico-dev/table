export type TNumbroFormat = {
  mantissa: number;
  output: 'percent' | 'number';
  average?: boolean;
  trimMantissa?: boolean;
};

export type TNumberFormat = TNumbroFormat & {
  absolute: boolean;
};

export const defaultNumberFormat: TNumberFormat = {
  mantissa: 0,
  output: 'number',
  trimMantissa: false,
  average: false,
  absolute: false,
};

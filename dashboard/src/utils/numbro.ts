// TODO: rename
export type TNumbroFormat = {
  mantissa: number;
  output: 'percent' | 'number';
  average?: boolean;
  trimMantissa?: boolean;
  absolute: boolean;
};

export const defaultNumbroFormat: TNumbroFormat = {
  mantissa: 0,
  output: 'number',
  trimMantissa: false,
  average: false,
  absolute: false,
};

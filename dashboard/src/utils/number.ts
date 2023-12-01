import numbro from 'numbro';

export type TNumbroFormat = {
  mantissa: number;
  output: 'percent' | 'number';
  average?: boolean;
  trimMantissa?: boolean;
  thousandSeparated?: boolean; // not supported yet
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

export function formatNumber(number: string | number | null, { absolute, ...format }: TNumberFormat) {
  if (number === null) {
    return number;
  }

  try {
    let num = numbro(number).value();
    if (absolute) {
      num = Math.abs(num);
    }
    return numbro(num).format(format);
  } catch (e) {
    console.error(e);
    return number;
  }
}

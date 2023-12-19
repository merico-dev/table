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

export function formatNumber(number: string | number | null, { absolute, ...format }: TNumberFormat): string {
  if (number === null) {
    return String(number);
  }

  try {
    let num = numbro(number).value();
    if (num === undefined) {
      throw new Error(`[formatNumber]Not a number: ${number}`);
    }
    if (absolute) {
      num = Math.abs(num);
    }
    return numbro(num).format(format);
  } catch (e) {
    console.debug(e);
    return String(number);
  }
}

import { TNumberFormat, formatNumber } from '~/utils';

export function getFormatter(formatter: TNumberFormat) {
  if (!formatter) {
    return (value: number) => value;
  }
  return (value: number) => {
    try {
      return formatNumber(value, formatter);
    } catch (error) {
      console.error(error);
      return value;
    }
  };
}

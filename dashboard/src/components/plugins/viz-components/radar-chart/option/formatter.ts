import numbro from 'numbro';
import { TNumberFormat } from '~/utils';

export function getFormatter(formatter: TNumberFormat) {
  if (!formatter) {
    return (value: number) => value;
  }
  return (value: number) => {
    try {
      return numbro(value).format(formatter);
    } catch (error) {
      console.error(error);
      return value;
    }
  };
}

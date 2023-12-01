import numbro from 'numbro';
import { TNumbroFormat } from '~/utils';

export function getFormatter(formatter: TNumbroFormat) {
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

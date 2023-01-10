import numbro from 'numbro';

export function formatPercentage(value: number) {
  return numbro(value).format({
    output: 'percent',
    mantissa: 0,
  });
}

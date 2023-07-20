export function getIndicatorColorStyle(color: string) {
  const ret = [`background-color: ${color}`];
  if (color === 'rgba(255, 255, 255, 1)') {
    ret.push('box-shadow: 0px 0px 1px 0px  rgba(0,0,0,.5)');
  }
  return ret.join(';');
}

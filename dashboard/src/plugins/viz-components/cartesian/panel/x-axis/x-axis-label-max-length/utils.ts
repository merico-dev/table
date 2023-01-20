import { IXAxisLabelMaxLength } from './types';

export function getXAxisLabelStyleInTooltip(max_length: IXAxisLabelMaxLength) {
  const { tooltip, x_axis } = max_length;
  const wordBreak = {
    truncate: 'initial',
    break: 'break-line',
    breakAll: 'break-word',
  }[tooltip.overflow];

  const whiteSpace = tooltip.overflow === 'truncate' ? 'nowrap' : 'initial';

  return `max-width: ${tooltip.length}px; word-break: ${wordBreak}; white-space: ${whiteSpace}; overflow: hidden; text-overflow: ellipsis`;
}

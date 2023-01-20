import { IXAxisLabelOverflow } from './types';

export function getXAxisLabelOptionInXAxis({ x_axis }: IXAxisLabelOverflow) {
  return {
    width: x_axis.width,
    overflow: x_axis.overflow,
    ellipsis: x_axis.ellipsis,
  };
}

export function getXAxisLabelStyleInTooltip(overflow: IXAxisLabelOverflow) {
  const { tooltip, x_axis } = overflow;
  const wordBreak = {
    truncate: 'initial',
    break: 'break-line',
    breakAll: 'break-word',
  }[tooltip.overflow];

  const whiteSpace = tooltip.overflow === 'truncate' ? 'nowrap' : 'initial';

  return `max-width: ${tooltip.width}px; word-break: ${wordBreak}; white-space: ${whiteSpace}; overflow: hidden; text-overflow: ellipsis`;
}

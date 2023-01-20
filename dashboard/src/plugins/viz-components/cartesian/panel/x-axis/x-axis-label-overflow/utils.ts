import { IXAxisLabelOverflow } from './types';

export function getXAxisLabelOptionInXAxis(x_axis: IXAxisLabelOverflow['x_axis']) {
  return {
    width: x_axis.width,
    overflow: x_axis.overflow,
    ellipsis: x_axis.ellipsis,
  };
}

export function getXAxisLabelStyleInTooltip(tooltip: IXAxisLabelOverflow['tooltip']) {
  const wordBreak = {
    truncate: 'initial',
    break: 'break-all',
    breakAll: 'break-word',
  }[tooltip.overflow];

  const whiteSpace = tooltip.overflow === 'truncate' ? 'nowrap' : 'initial';

  const textOverflow = {
    truncate: 'ellipsis',
    break: 'clip',
    breakAll: 'clip',
  }[tooltip.overflow];

  return `
    max-width: ${tooltip.width}px;
    word-break: ${wordBreak};
    white-space: ${whiteSpace};
    overflow: hidden;
    text-overflow: ${textOverflow};
  `;
}

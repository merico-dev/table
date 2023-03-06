import { IAxisLabelOverflow } from './types';

export function getLabelOverflowStyleInTooltip({ overflow, width }: IAxisLabelOverflow['in_tooltip']) {
  const wordBreak = {
    truncate: 'initial',
    break: 'break-all',
    breakAll: 'break-word',
  }[overflow];

  const whiteSpace = overflow === 'truncate' ? 'nowrap' : 'initial';

  const textOverflow = {
    truncate: 'ellipsis',
    break: 'clip',
    breakAll: 'clip',
  }[overflow];

  return `
    max-width: ${width}px;
    word-break: ${wordBreak};
    white-space: ${whiteSpace};
    overflow: hidden;
    text-overflow: ${textOverflow};
  `;
}
export function getLabelOverflowOptionOnAxis(overflow: IAxisLabelOverflow) {
  return {
    width: overflow.on_axis.width,
    overflow: overflow.on_axis.overflow,
    ellipsis: overflow.on_axis.ellipsis,
  };
}

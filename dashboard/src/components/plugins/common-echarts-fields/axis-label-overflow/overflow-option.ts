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
export function getLabelOverflowOptionOnAxis(on_axis: IAxisLabelOverflow['on_axis']) {
  return {
    width: on_axis.width,
    overflow: on_axis.overflow,
    ellipsis: on_axis.ellipsis,
  };
}

export interface IEchartsOverflow {
  width: number;
  overflow: 'truncate' | 'break' | 'breakAll';
  ellipsis: '...';
}

export interface IAxisLabelOverflow {
  on_axis: IEchartsOverflow;
  in_tooltip: IEchartsOverflow;
}

export function getDefaultAxisLabelOverflow(): IAxisLabelOverflow {
  return {
    on_axis: {
      width: 80,
      overflow: 'truncate',
      ellipsis: '...',
    },
    in_tooltip: {
      width: 200,
      overflow: 'break',
      ellipsis: '...',
    },
  };
}

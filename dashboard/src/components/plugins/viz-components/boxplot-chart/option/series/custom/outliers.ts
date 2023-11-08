import { AnyObject } from '~/types';
import { RenderProps } from './type';

export function getOutliers({ payload, layout }: RenderProps) {
  const { categoryIndex, outlierGroup, api } = payload;
  const w = layout[0].width;

  const dots: AnyObject[] = [];
  Object.entries(outlierGroup).forEach(([value, count]) => {
    const [x, y] = api.coord([categoryIndex, value]);
    const start = x + layout[0].offset;
    for (let i = 0; i < count; i++) {
      const cx = start + Math.random() * w;
      dots.push({ cx, cy: y });
    }
  });

  const dotStyle = {
    fill: '#ED6A45',
  };
  const outliers = {
    type: 'group',
    children: dots.map((d) => ({
      type: 'circle',
      transition: ['shape'],
      shape: {
        ...d,
        r: 3,
      },
      style: dotStyle,
    })),
  };
  return outliers;
}

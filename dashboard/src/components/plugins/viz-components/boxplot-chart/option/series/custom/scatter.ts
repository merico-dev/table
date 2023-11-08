import { AnyObject } from '~/types';
import { RenderProps } from './type';

export function getScatter({ layout, payload }: RenderProps) {
  const { categoryIndex, arr, api } = payload;
  const w = layout[0].width;

  const dots: AnyObject[] = [];
  arr.forEach(([value, count]) => {
    const [x, y] = api.coord([categoryIndex, value]);
    const start = x + layout[0].offset;
    for (let i = 0; i < count; i++) {
      const cx = start + Math.random() * w;
      dots.push({ cx, cy: y });
    }
  });

  const dotStyle = {
    fill: '#ED6A45',
    opacity: 0.5,
  };

  const scatter = {
    type: 'group',
    children: dots.map((d) => ({
      type: 'circle',
      transition: ['shape'],
      shape: {
        ...d,
        r: 2,
      },
      style: dotStyle,
    })),
  };

  return scatter;
}

import { ChartTheme } from '~/styles/register-themes';
import { VisualMap } from './types';

function getDefaultVisualMap(color: string[]): VisualMap {
  return {
    type: 'continuous',
    id: 'continuous-example',
    min: 0,
    max: 100,
    orient: 'horizontal',
    left: 'center',
    top: 'center',
    text: ['满分', '零分'],
    calculable: true,
    itemWidth: 20,
    itemHeight: 140,
    show: true,
    inRange: {
      color,
    },
  };
}

export function getDefaultDepthVisualMap() {
  return getDefaultVisualMap(Object.values(ChartTheme.graphics.depth));
}

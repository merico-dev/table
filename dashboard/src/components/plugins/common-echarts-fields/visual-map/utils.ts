import { ChartTheme } from '~/styles/register-themes';
import { VisualMap } from './types';

function getDefaultVisualMap(color: string[]): VisualMap {
  return {
    type: 'continuous',
    id: 'continuous-example',
    min: {
      type: 'static',
      value: 0,
    },
    max: {
      type: 'static',
      value: 100,
    },
    orient: 'horizontal',
    left: 'center',
    top: 'center',
    text: ['', ''],
    calculable: true,
    itemWidth: 15,
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

export function getVisualMapPalettes() {
  return {
    red: ['#FFF7F8', '#FFE1E1', '#FDBCBC', '#F39494', '#FA4242', '#E21212'],
    yellow_blue: ['#8f531d', '#ffd347', '#e3efe3', '#eefaee', '#4ecbbf', '#003f94'],
    blue: ['#f9fcff', '#48b3e9', '#003f94'],
    darkgreen_pink: ['#0c525a', '#f21f99'],
    spectrum: ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'],
  };
}

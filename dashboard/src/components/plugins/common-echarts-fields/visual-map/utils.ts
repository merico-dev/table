import { ChartTheme } from '~/styles/register-themes';
import { getNumberOrDynamicValue } from '../number-or-dynamic-value';
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
    top: 'top',
    text: ['', ''],
    calculable: true,
    itemWidth: 15,
    itemHeight: 140,
    show: true,
    inRange: {
      color,
    },
    skipRange: {
      lt_min: '',
      min: '',
      max: '',
      gt_max: '',
    },
  };
}

export function getDefaultDepthVisualMap() {
  return getDefaultVisualMap(Object.values(ChartTheme.graphics.depth));
}

export function getVisualMapPalettes() {
  return {
    compared: Object.values(ChartTheme.graphics.compared),
    level: Object.values(ChartTheme.graphics.level),
    depth: Object.values(ChartTheme.graphics.depth),
    yellow_blue: ['#8f531d', '#ffd347', '#e3efe3', '#eefaee', '#4ecbbf', '#003f94'],
    blue: ['#f9fcff', '#48b3e9', '#003f94'],
    darkgreen_pink: ['#0c525a', '#f21f99'],
    spectrum: ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'],
  };
}

export function getVisualMap(visualMap: VisualMap, variableValueMap: Record<string, string | number>) {
  const min = getNumberOrDynamicValue(visualMap.min, variableValueMap);
  const max = getNumberOrDynamicValue(visualMap.max, variableValueMap);
  if (visualMap.type === 'continuous') {
    const { skipRange, ...rest } = visualMap;
    return {
      ...rest,
      min,
      max,
    };
  }
  return {
    ...visualMap,
    min,
    max,
  };
}

export function getSkipRangeColor(value: number, min: number, max: number, visualMap: VisualMap) {
  if (visualMap.type !== 'continuous') {
    return { followVisualMap: true, color: '' };
  }
  const { skipRange } = visualMap;
  if (value === min) {
    return { followVisualMap: false, color: skipRange.min };
  }
  if (value === max) {
    return { followVisualMap: false, color: skipRange.max };
  }
  if (value < min) {
    return { followVisualMap: false, color: skipRange.lt_min };
  }
  if (value > max) {
    return { followVisualMap: false, color: skipRange.gt_max };
  }
  return { followVisualMap: true, color: '' };
}

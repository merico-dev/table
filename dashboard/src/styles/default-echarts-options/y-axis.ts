import _ from 'lodash';
import { AnyObject } from '~/types';

export const yAxis = {
  axisTick: {
    show: false,
  },
  axisLine: {
    show: false,
    lineStyle: {
      width: 3,
    },
  },
  splitLine: {
    show: true,
    lineStyle: {
      type: 'dashed',
    },
  },
};

export function getYAxis(option: AnyObject) {
  return _.defaultsDeep({}, option, yAxis);
}

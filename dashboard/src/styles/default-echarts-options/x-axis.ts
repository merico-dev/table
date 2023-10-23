import _ from 'lodash';
import { AnyObject } from '~/types';

export const xAxis = {
  axisTick: {
    show: true,
    alignWithLabel: true,
    lineStyle: {
      width: 2,
    },
  },
  axisLine: {
    show: true,
    lineStyle: {
      width: 3,
    },
  },
  splitLine: {
    show: false,
  },
  z: 3,
};

export function getXAxis(option: AnyObject) {
  return _.defaultsDeep({}, option, xAxis);
}

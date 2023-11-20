import _ from 'lodash';
import { AnyObject } from '~/types';

export const tooltip = {
  confine: true,
  appendToBody: true,
};

export function getTooltip(option: AnyObject) {
  return _.defaultsDeep({}, option, tooltip);
}

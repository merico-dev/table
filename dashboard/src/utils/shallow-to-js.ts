import { toJS } from 'mobx';
import { cloneDeepWith } from 'lodash';

export const shallowToJS = <T>(obj: T): T => {
  return cloneDeepWith(obj, (value, key) => {
    if (key === undefined) {
      return;
    }
    if (value) {
      return toJS(value);
    }
  });
};

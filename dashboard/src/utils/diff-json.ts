import _ from 'lodash';
import { AnyObject } from '..';

function printChanges(a: any, b: any) {
  if (_.isEqual(a, b)) {
    return;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    a.forEach((_a, i) => {
      printChanges(_a, b[i]);
    });
    return;
  }
  console.log(a, b);
}

export function printJSONChanges(a: AnyObject, b: AnyObject) {
  Object.keys(a).forEach((k) => {
    printChanges(a[k], b[k]);
  });
}

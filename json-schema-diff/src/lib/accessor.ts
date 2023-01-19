import { IAccessor } from './types/core';
import { has } from 'lodash-es';

export class Accessor implements IAccessor {
  constructor(public key: string) {}

  get path() {
    return [this.key];
  }

  in(obj: any) {
    return has(obj, this.key);
  }

  get(obj: any) {
    return obj[this.key];
  }

  set(obj: any, value: any) {
    obj[this.key] = value;
  }
}

export function createAccessor(key: string) {
  return new Accessor(key);
}

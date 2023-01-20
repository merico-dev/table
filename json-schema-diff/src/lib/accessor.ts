import { IAccessor } from './types/core';
import { get, has, set } from 'lodash-es';

export class Accessor implements IAccessor {
  constructor(public key: string) {}

  get path() {
    return [this.key];
  }

  in(obj: any) {
    return has(obj, this.key);
  }

  get(obj: any) {
    return get(obj, this.key);
  }

  set(obj: any, value: any) {
    set(obj, this.key, value);
  }
}

export function createAccessor(key: string) {
  return new Accessor(key);
}

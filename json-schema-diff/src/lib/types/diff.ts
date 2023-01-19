/* eslint-disable @typescript-eslint/no-explicit-any */
import { Difference } from './core';

export interface AddFiled extends Difference {
  type: 'add';
  value: any;
}

export interface RemoveField extends Difference {
  type: 'remove';
}

export interface UpdateField extends Difference {
  type: 'update';
  value: any;
}

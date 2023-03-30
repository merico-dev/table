import { Accessor, IObjectPointer } from '@zeeko/power-accessor';

export type ObjectChangeType = 'added' | 'removed' | 'modified' | 'unchanged';
export interface IDiffTarget<T, TId> {
  selector: Accessor<object, object>;
  idSelector: (item: T) => TId;
  formatDisplayName: (item: T) => string;
  produceOperation: (operationType: ObjectChangeType, pointers: IDiffContextPointers, item: T) => (doc: object) => void;
}

export interface IDiffContextPointers {
  base?: IObjectPointer<object, object>;
  local?: IObjectPointer<object, object>;
  remote?: IObjectPointer<object, object>;
}

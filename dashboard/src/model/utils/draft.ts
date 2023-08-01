import { isEqual } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { applySnapshot, clone, getSnapshot, IAnyStateTreeNode, SnapshotIn } from 'mobx-state-tree';

export class DraftModel<T extends IAnyStateTreeNode> {
  origin: T;
  copy: T;

  constructor(state: T) {
    this.origin = state;
    this.copy = clone(state);
    makeAutoObservable(this, {}, { autoBind: true, deep: false });
  }

  get changed() {
    return !isEqual(getSnapshot(this.origin), getSnapshot(this.copy));
  }

  commit() {
    applySnapshot(this.origin, getSnapshot(this.copy));
  }

  update(patch: SnapshotIn<T>) {
    applySnapshot(this.copy, patch);
  }
}

export const createDraft = <T extends IAnyStateTreeNode>(origin: T) => {
  return new DraftModel(origin);
};

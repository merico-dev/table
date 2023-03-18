import { IObjectPointer, toPointers } from '@zeeko/power-accessor';
import { IDiffTarget, ObjectChangeType } from './types';
import { cloneDeep, isEqual } from 'lodash';
import { makeAutoObservable, observable, toJS } from 'mobx';
import { AnyObject } from '@devtable/dashboard';

function getChangeType(base: object | undefined, maybeChanged: object | undefined): ObjectChangeType {
  if (base && maybeChanged) {
    return isEqual(base, maybeChanged) ? 'unchanged' : 'modified';
  }
  if (base == null && maybeChanged) {
    return 'added';
  }
  if (base && maybeChanged == null) {
    return 'removed';
  }
  return 'unchanged';
}

export interface IResolveResult {
  from: 'local' | 'remote' | 'base';
  operation: (document: object) => void;
}

function resolveByLocal(diff: NodeDiffContext): IResolveResult {
  return {
    from: 'local',
    operation: diff.target.produceOperation(
      diff.localChanges,
      toJS(diff.pointers),
      diff.localChanges === 'removed' ? cloneDeep(diff.values.base!) : cloneDeep(diff.values.local!),
    ),
  };
}

function resolveByRemote(diff: NodeDiffContext): IResolveResult {
  return {
    from: 'remote',
    operation: diff.target.produceOperation(
      diff.remoteChanges,
      diff.pointers,
      diff.remoteChanges === 'removed' ? cloneDeep(diff.values.base!) : cloneDeep(diff.values.remote!),
    ),
  };
}

export interface IMergeJsonDocs {
  local: object;
  remote: object;
  base: object;
}

export class NodeDiffContext {
  target: IDiffTarget<object, string>;
  pointers: {
    base?: IObjectPointer<object, object>;
    local?: IObjectPointer<object, object>;
    remote?: IObjectPointer<object, object>;
  } = { base: undefined, local: undefined, remote: undefined };
  documents: IMergeJsonDocs;

  constructor(target: IDiffTarget<any, string>, documents: IMergeJsonDocs) {
    this.target = target;
    this.documents = documents;
    makeAutoObservable(this, {
      pointers: observable.shallow,
      documents: observable.shallow,
      target: observable.ref,
    });
  }

  get values() {
    return {
      base: this.pointers.base?.get(this.documents.base),
      local: this.pointers.local?.get(this.documents.local),
      remote: this.pointers.remote?.get(this.documents.remote),
    };
  }

  get key(): string {
    if (this.values.base) {
      return this.target.idSelector(this.values.base);
    }
    if (this.values.local) {
      return this.target.idSelector(this.values.local);
    }
    if (this.values.remote) {
      return this.target.idSelector(this.values.remote);
    }
    throw new Error('Cannot get key from empty diff');
  }

  get localChanges() {
    return getChangeType(this.values.base, this.values.local);
  }

  get remoteChanges() {
    return getChangeType(this.values.base, this.values.remote);
  }

  get hasChanges() {
    return this.localChanges !== 'unchanged' || this.remoteChanges !== 'unchanged';
  }

  get hasConflicts() {
    return (
      this.localChanges !== 'unchanged' &&
      this.remoteChanges !== 'unchanged' &&
      !isEqual(this.values.local, this.values.remote)
    );
  }

  get objectDescription() {
    if (this.localChanges === 'added') {
      return this.target.formatDisplayName(this.values.local!);
    }
    if (this.remoteChanges === 'added') {
      return this.target.formatDisplayName(this.values.remote!);
    }
    if (this.localChanges === 'removed') {
      return this.target.formatDisplayName(this.values.base!);
    }
    if (this.remoteChanges === 'removed') {
      return this.target.formatDisplayName(this.values.base!);
    }
    if (this.localChanges === 'modified') {
      return this.target.formatDisplayName(this.values.local!);
    }
    if (this.remoteChanges === 'modified') {
      return this.target.formatDisplayName(this.values.base!);
    }
    return this.target.formatDisplayName(this.values.base!);
  }

  get changesDescription() {
    if (!this.hasChanges) {
      return 'No changes';
    }
    if (this.localChanges !== 'unchanged' && this.remoteChanges !== 'unchanged') {
      return `Local: ${this.localChanges}, Remote: ${this.remoteChanges}`;
    }
    if (this.localChanges !== 'unchanged') {
      return `Local: ${this.localChanges}`;
    }
    if (this.remoteChanges !== 'unchanged') {
      return `Remote: ${this.remoteChanges}`;
    }
  }

  setBase(value: IObjectPointer<object, object>) {
    this.pointers.base = value;
  }

  setLocal(value: IObjectPointer<object, object>) {
    this.pointers.local = value;
  }

  setRemote(value: IObjectPointer<object, object>) {
    this.pointers.remote = value;
  }
}

function addBaseToResult(
  nodesInBase: IObjectPointer<object, object>[],
  result: Map<string, NodeDiffContext>,
  target: IDiffTarget<object, string>,
  documents: IMergeJsonDocs,
) {
  for (const obj of nodesInBase) {
    const key = target.idSelector(obj.get(documents.base));
    const item = result.get(key);
    if (item) {
      item.setBase(obj);
    } else {
      const r = new NodeDiffContext(target, documents);
      r.setBase(obj);
      result.set(key, r);
    }
  }
}

function addLocalChangesToResult(
  nodesInLocal: IObjectPointer<object, object>[],
  result: Map<string, NodeDiffContext>,
  target: IDiffTarget<AnyObject, string>,
  documents: IMergeJsonDocs,
) {
  for (const obj of nodesInLocal) {
    const key = target.idSelector(obj.get(documents.local));
    const item = result.get(key);
    if (item) {
      item.setLocal(obj);
    } else {
      const r = new NodeDiffContext(target, documents);
      r.setLocal(obj);
      result.set(key, r);
    }
  }
}

function addRemoteChangesToResult(
  nodesInRemote: IObjectPointer<object, object>[],
  result: Map<string, NodeDiffContext>,
  target: IDiffTarget<AnyObject, string>,
  documents: IMergeJsonDocs,
) {
  for (const obj of nodesInRemote) {
    const id = target.idSelector(obj.get(documents.remote));
    const item = result.get(id);
    if (item) {
      item.setRemote(obj);
    } else {
      const r = new NodeDiffContext(target, documents);
      r.setRemote(obj);
      result.set(id, r);
    }
  }
}

export class MergeJsonDocsState {
  public diffTargets: IDiffTarget<AnyObject, string>[] = [];
  localDocument: object = {};
  remoteDocument: object = {};
  baseDocument: object = {};
  /**
   * List of difference keys that have been resolved by the user
   */
  resolvedDifferences = new Map<string, IResolveResult>();

  constructor() {
    makeAutoObservable(this, {
      localDocument: observable.ref,
      baseDocument: observable.ref,
      remoteDocument: observable.ref,
    });
  }

  get documents(): IMergeJsonDocs {
    console.log('get documents');
    return {
      base: this.baseDocument,
      local: this.localDocument,
      remote: this.remoteDocument,
    };
  }

  get differences() {
    if (this.baseDocument == null || this.localDocument == null || this.remoteDocument == null) {
      return [];
    }
    const result = new Map<string, NodeDiffContext>();
    for (const target of this.diffTargets) {
      const nodesInBase = toPointers(target.selector, this.baseDocument);
      addBaseToResult(nodesInBase, result, target, this.documents);
      const nodesInLocal = toPointers(target.selector, this.localDocument);
      console.log('diff', target);
      console.log('nodesInLocal', nodesInLocal, result);
      addLocalChangesToResult(nodesInLocal, result, target, this.documents);
      const nodesInRemote = toPointers(target.selector, this.remoteDocument);
      addRemoteChangesToResult(nodesInRemote, result, target, this.documents);
    }
    return Array.from(result.values()).filter((v) => v.hasChanges);
  }

  get conflicts() {
    return this.differences.filter((v) => v.hasConflicts);
  }

  get canApply() {
    return this.differences.length === this.resolvedDifferences.size;
  }

  setDiffNodes(diffNodes: IDiffTarget<AnyObject, string>[]) {
    this.diffTargets = diffNodes;
  }

  setLocalDocument(doc: object) {
    this.localDocument = doc;
  }

  setRemoteDocument(doc: object) {
    this.remoteDocument = doc;
  }

  setBaseDocument(doc: object) {
    this.baseDocument = doc;
  }

  isResolved(key: string) {
    return this.resolvedDifferences.has(key);
  }

  acceptLocalChanges(diff: NodeDiffContext) {
    this.resolvedDifferences.set(diff.key, resolveByLocal(diff));
  }

  acceptRemoteChange(diff: NodeDiffContext) {
    this.resolvedDifferences.set(diff.key, resolveByRemote(diff));
  }

  undo() {
    const lastKey = Array.from(this.resolvedDifferences.keys()).pop();
    if (lastKey) {
      this.resolvedDifferences.delete(lastKey);
    }
  }

  reset() {
    this.resolvedDifferences.clear();
  }
}

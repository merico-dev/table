/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-explicit-any */
import { IDiffTarget, ObjectChangeType } from './types';
import { Button, Card, Group, Stack, Text } from '@mantine/core';
import { makeAutoObservable, observable, toJS } from 'mobx';
import { cloneDeep, isEqual } from 'lodash';
import { useCreation } from 'ahooks';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { IObjectPointer, toPointers } from '@zeeko/power-accessor';
import { AnyObject } from '@devtable/dashboard';

export interface IJsonMergeEditorProps {
  documents: {
    local: object;
    remote: object;
    base: object;
  };
  diffNodes: IDiffTarget<any, string>[];
  onApply?: (resolveList: IResolveResult[]) => void;
}

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

export class NodeDiffContext {
  target: IDiffTarget<object, string>;
  pointers: {
    base?: IObjectPointer<object, object>;
    local?: IObjectPointer<object, object>;
    remote?: IObjectPointer<object, object>;
  } = { base: undefined, local: undefined, remote: undefined };
  documents: IJsonMergeEditorProps['documents'];

  constructor(target: IDiffTarget<any, string>, documents: IJsonMergeEditorProps['documents']) {
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
  documents: IJsonMergeEditorProps['documents'],
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
  documents: IJsonMergeEditorProps['documents'],
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
  documents: IJsonMergeEditorProps['documents'],
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

class JsonMergeEditorState {
  public diffTargets: IDiffTarget<AnyObject, string>[] = [];
  localDocument: object = {};
  remoteDocument: object = {};
  baseDocument: object = {};

  constructor() {
    makeAutoObservable(this, {
      localDocument: observable.ref,
      baseDocument: observable.ref,
      remoteDocument: observable.ref,
    });
  }

  /**
   * List of difference keys that have been resolved by the user
   */
  resolvedDifferences = new Map<string, IResolveResult>();

  get documents(): IJsonMergeEditorProps['documents'] {
    return {
      base: this.baseDocument,
      local: this.localDocument,
      remote: this.remoteDocument,
    };
  }

  get differences() {
    const result = new Map<string, NodeDiffContext>();
    for (const target of this.diffTargets) {
      const nodesInBase = toPointers(target.selector, this.baseDocument);
      addBaseToResult(nodesInBase, result, target, this.documents);
      const nodesInLocal = toPointers(target.selector, this.localDocument);
      addLocalChangesToResult(nodesInLocal, result, target, this.documents);
      const nodesInRemote = toPointers(target.selector, this.remoteDocument);
      addRemoteChangesToResult(nodesInRemote, result, target, this.documents);
    }
    return Array.from(result.values()).filter((v) => v.hasChanges && v.hasConflicts);
  }

  setDiffNodes(diffNodes: IDiffTarget<AnyObject, string>[]) {
    this.diffTargets = diffNodes;
  }

  setOriginalDocument(doc: object) {
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

  get canApply() {
    return this.differences.length === this.resolvedDifferences.size;
  }
}

export const JsonMergeEditor = observer((props: IJsonMergeEditorProps) => {
  const state = useCreation(() => new JsonMergeEditorState(), []);
  useEffect(() => {
    state.setDiffNodes(props.diffNodes);
  }, [props.diffNodes]);
  useEffect(() => {
    state.setOriginalDocument(props.documents.local);
  }, [props.documents.local]);
  useEffect(() => {
    state.setRemoteDocument(props.documents.remote);
  }, [props.documents.remote]);
  useEffect(() => {
    state.setBaseDocument(props.documents.base);
  }, [props.documents.base]);

  const handleApply = () => {
    props.onApply?.(Array.from(state.resolvedDifferences.values()).map((it) => toJS(it)));
  };

  return (
    <Stack>
      <Card style={{ position: 'sticky', top: 0, zIndex: 2 }} withBorder shadow="sm">
        <Group position="apart">
          <Group>
            <Text>Total changes: {state.differences.length}</Text>
            <Text>Pending changes: {state.resolvedDifferences.size}</Text>
          </Group>
          <Group>
            <Button disabled={state.resolvedDifferences.size === 0} variant="outline" onClick={() => state.undo()}>
              Undo
            </Button>
            <Button variant="outline">Cancel</Button>
            <Button disabled={!state.canApply} onClick={handleApply}>
              Apply
            </Button>
          </Group>
        </Group>
      </Card>
      {state.differences.map((diff) => (
        <Card key={diff.key} withBorder>
          <Group position="apart" aria-label={'changed: ' + diff.objectDescription}>
            <Stack spacing="xs">
              <Text>{diff.objectDescription}</Text>
              <LocalChangesText diff={diff} resolvedResult={state.resolvedDifferences.get(diff.key)} />
              <RemoteChangesText diff={diff} resolvedResult={state.resolvedDifferences.get(diff.key)} />
            </Stack>
            {state.isResolved(diff.key) ? null : (
              <Stack spacing="xs">
                {/*<Button size="xs" variant="outline">Merge Manually</Button>*/}
                <Button aria-label="accept local" size="xs" onClick={() => state.acceptLocalChanges(diff)}>
                  Accept Local
                </Button>
                <Button aria-label="accept remote" size="xs" onClick={() => state.acceptRemoteChange(diff)}>
                  Accept Remote
                </Button>
              </Stack>
            )}
          </Group>
        </Card>
      ))}
    </Stack>
  );
});

const LocalChangesText = observer(
  ({ diff, resolvedResult }: { diff: NodeDiffContext; resolvedResult?: IResolveResult }) => {
    const resolved = !!resolvedResult;
    return (
      <Text
        color={resolved && resolvedResult.from === 'local' ? 'green' : 'gray'}
        strikethrough={resolved && resolvedResult.from !== 'local'}
      >
        Local: {diff.localChanges}
      </Text>
    );
  },
);

const RemoteChangesText = observer(
  ({ diff, resolvedResult }: { diff: NodeDiffContext; resolvedResult?: IResolveResult }) => {
    const resolved = !!resolvedResult;
    return (
      <Text
        color={resolved && resolvedResult.from === 'remote' ? 'green' : 'gray'}
        strikethrough={resolved && resolvedResult.from !== 'remote'}
      >
        Remote: {diff.remoteChanges}
      </Text>
    );
  },
);

// todo:
// x list of diff nodes
// x accept local changes
// x accept remote changes
// - detail view of node (3 way merge view)
// x power accessor get accessor

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IDiffTarget } from '~/definition-editor/json-merge-editor/types';
import { Button, Card, Group, Stack, Text } from '@mantine/core';
import { makeAutoObservable, observable } from 'mobx';
import { isEqual } from 'lodash';
import { useCreation } from 'ahooks';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

export interface IJsonMergeEditorProps {
  documents: {
    local: object;
    remote: object;
    base: object;
  };
  diffNodes: IDiffTarget<unknown, string>[];
}

type ObjectChangeType = 'added' | 'removed' | 'modified' | 'unchanged';

function getChangeType(base: object | undefined, maybeChanged: object | undefined) {
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

class NodeDiffContext {
  target: IDiffTarget<object, string>;
  values: {
    base?: object;
    local?: object;
    remote?: object;
  } = { base: undefined, local: undefined, remote: undefined };

  constructor(target: IDiffTarget<object, string>) {
    this.target = target;
    makeAutoObservable(this, {
      values: observable.shallow,
      target: observable.ref,
    });
  }

  get key() {
    if (this.values.base) {
      return this.target.idSelector(this.values.base);
    }
    if (this.values.local) {
      return this.target.idSelector(this.values.local);
    }
    if (this.values.remote) {
      return this.target.idSelector(this.values.remote);
    }
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
      return this.target.formatDisplayName(this.values.remote!);
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

  setBase(value: object) {
    this.values.base = value;
  }

  setLocal(value: object) {
    this.values.local = value;
  }

  setRemote(value: object) {
    this.values.remote = value;
  }
}

export interface INodeDiffContext {
  baseValue?: object;
  local?: ObjectChangeType;
  remote?: ObjectChangeType;
}

function addBaseToResult(
  nodesInBase: object[],
  result: Map<string, NodeDiffContext>,
  target: IDiffTarget<object, string>,
) {
  for (const obj of nodesInBase) {
    const item = result.get(target.idSelector(obj));
    if (item) {
      item.setBase(obj);
    } else {
      const r = new NodeDiffContext(target);
      r.setBase(obj);
      result.set(target.idSelector(obj), r);
    }
  }
}

function addLocalChangesToResult(
  nodesInLocal: object[],
  result: Map<string, NodeDiffContext>,
  target: IDiffTarget<unknown, string>,
) {
  for (const obj of nodesInLocal) {
    const item = result.get(target.idSelector(obj));
    if (item) {
      item.setLocal(obj);
    } else {
      const r = new NodeDiffContext(target);
      r.setLocal(obj);
      result.set(target.idSelector(obj), r);
    }
  }
}

function addRemoteChangesToResult(
  nodesInRemote: object[],
  result: Map<string, NodeDiffContext>,
  target: IDiffTarget<unknown, string>,
) {
  for (const obj of nodesInRemote) {
    const id = target.idSelector(obj);
    const item = result.get(id);
    if (item) {
      item.setRemote(obj);
    } else {
      const r = new NodeDiffContext(target);
      r.setRemote(obj);
      result.set(id, r);
    }
  }
}

class JsonMergeEditorState {
  public diffTargets: IDiffTarget<unknown, string>[] = [];
  originalDocument: object = {};
  remoteDocument: object = {};
  baseDocument: object = {};

  constructor() {
    makeAutoObservable(this, {
      originalDocument: observable.ref,
      baseDocument: observable.ref,
      remoteDocument: observable.ref,
    });
  }

  get differences() {
    const result = new Map<string, NodeDiffContext>();
    for (const target of this.diffTargets) {
      const nodesInBase = target.selector.get(this.baseDocument);
      addBaseToResult(nodesInBase, result, target);
      const nodesInLocal = target.selector.get(this.originalDocument);
      addLocalChangesToResult(nodesInLocal, result, target);
      const nodesInRemote = target.selector.get(this.remoteDocument);
      addRemoteChangesToResult(nodesInRemote, result, target);
    }
    return Array.from(result.values()).filter((v) => v.hasChanges);
  }

  setDiffNodes(diffNodes: IDiffTarget<unknown, string>[]) {
    this.diffTargets = diffNodes;
  }

  setOriginalDocument(doc: object) {
    this.originalDocument = doc;
  }

  setRemoteDocument(doc: object) {
    this.remoteDocument = doc;
  }

  setBaseDocument(doc: object) {
    this.baseDocument = doc;
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

  return (
    <Stack>
      {state.differences.map((diff) => (
        <Card key={diff.key} withBorder>
          <Group position="apart">
            <Stack spacing="xs">
              <Text>{diff.objectDescription}</Text>
              <Text>Local: {diff.localChanges}</Text>
              <Text>Remote: {diff.remoteChanges}</Text>
            </Stack>
            <Stack spacing="xs">
              {/*<Button size="xs" variant="outline">Merge Manually</Button>*/}
              <Button size="xs">Accept Local</Button>
              <Button size="xs">Accept Remote</Button>
            </Stack>
          </Group>
        </Card>
      ))}
    </Stack>
  );
});

// todo:
// x list of diff nodes
// - accept local changes
// - accept remote changes
// - detail view of node (3 way merge view)

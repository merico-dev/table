import { Button } from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import { useCreation } from 'ahooks';
import _ from 'lodash';
import { cloneDeep } from 'lodash';
import { reaction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Instance } from 'mobx-state-tree';
import { useEffect } from 'react';
import { useDashboardStore } from '../../../frames/app/models/dashboard-store-context';
import { diffNodes, RebaseDashboardConfigModal } from './rebase-editor';
import { IResolveResult, MergeJsonDocsState } from './rebase-editor/merge-json-docs-state';
import { RebaseConfigModel, RebaseConfigModelInstance } from './rebase-editor/rebase-config-context';

function useMergeDocState(rebaseModel: Instance<typeof RebaseConfigModel>) {
  const mergeDocState = useCreation(() => {
    const state = new MergeJsonDocsState();
    state.setDiffNodes(diffNodes);
    return state;
  }, []);
  useEffect(() => {
    return reaction(
      () => toJS(rebaseModel.base),
      (base) => {
        if (base) {
          mergeDocState.setBaseDocument(base);
        }
      },
      { fireImmediately: true },
    );
  }, [rebaseModel, mergeDocState]);
  useEffect(() => {
    return reaction(
      () => toJS(rebaseModel.local),
      (local) => {
        if (local) {
          mergeDocState.setLocalDocument(local);
        }
      },
      { fireImmediately: true },
    );
  }, [rebaseModel, mergeDocState]);
  useEffect(() => {
    return reaction(
      () => toJS(rebaseModel.remote),
      (remote) => {
        if (remote) {
          mergeDocState.setRemoteDocument(remote);
        }
      },
      { fireImmediately: true },
    );
  }, [rebaseModel, mergeDocState]);
  return mergeDocState;
}

interface IRebaseActions {
  rebaseModel: RebaseConfigModelInstance;
  remoteKey: string;
  onFinish: () => void;
}

export const RebaseActions = observer(({ rebaseModel, remoteKey, onFinish }: IRebaseActions) => {
  const { store } = useDashboardStore();
  const mergeState = useMergeDocState(rebaseModel);

  const hasConflicts = mergeState.conflicts.length > 0;

  const handleApply = (changes: IResolveResult[]) => {
    const copy = cloneDeep(store.currentDetail?.content.fullData);
    if (!copy) {
      return;
    }
    for (const change of changes) {
      change.operation(copy);
    }
    rebaseModel.setRebaseResult(copy);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    rebaseModel.markResolvedRemote(remoteKey!);
    mergeState.reset();
    onFinish();
  };

  if (hasConflicts && rebaseModel.canMergeChanges) {
    return <RebaseDashboardConfigModal state={mergeState} onApply={handleApply} />;
  }

  const rebase = () => {
    mergeState.differences.forEach((diff) => {
      const baseVersion = toJS(_.get(diff.values, 'base'));
      const localVersion = toJS(_.get(diff.values, 'local'));
      const remoteVersion = toJS(_.get(diff.values, 'remote'));
      const localChanged = !!localVersion && !_.isEqual(baseVersion, localVersion);
      const remoteChanged = !!remoteVersion && !_.isEqual(baseVersion, remoteVersion);

      console.group(`Rebasing ${diff.objectDescription}`);
      console.log(`localChanges: ${diff.localChanges} | remoteChanges: ${diff.remoteChanges}`);
      if (!localChanged && !remoteChanged) {
        console.groupEnd();
        return;
      }
      if (localChanged) {
        console.log('Accepting local changes: ', localVersion);
        mergeState.acceptLocalChanges(diff);
      } else {
        console.log('Accepting remote changes: ', remoteVersion);
        mergeState.acceptRemoteChange(diff);
      }
      console.groupEnd();
    });
    const changes = Array.from(mergeState.resolvedDifferences.values()).map((it) => toJS(it));
    handleApply(changes);
  };
  return (
    <Button size="xs" variant="filled" color="green" onClick={rebase} leftIcon={<IconCheck size={14} />}>
      Accept incoming changes
    </Button>
  );
});

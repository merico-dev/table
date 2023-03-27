import { IDashboard } from '@devtable/dashboard';
import { Button } from '@mantine/core';
import { useCreation } from 'ahooks';
import { cloneDeep, isEqual, pick } from 'lodash';
import { reaction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Instance } from 'mobx-state-tree';
import { useEffect } from 'react';
import { useDashboardStore } from '../../../frames/app/models/dashboard-store-context';
import { diffNodes, RebaseDashboardConfigModal } from './rebase-editor';
import { IResolveResult, MergeJsonDocsState } from './rebase-editor/merge-json-docs-state';
import { RebaseConfigModel, RebaseConfigModelInstance } from './rebase-editor/rebase-config-context';

const diffPaths = ['filters', 'definition', 'panels', 'views'];

function isConfigEqual(a: IDashboard, b?: IDashboard) {
  return isEqual(pick(a, diffPaths), pick(b, diffPaths));
}

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
}

export const RebaseActions = observer(({ rebaseModel, remoteKey }: IRebaseActions) => {
  const { store } = useDashboardStore();
  const mergeState = useMergeDocState(rebaseModel);

  const noLocalChanges = rebaseModel.local == null || isConfigEqual(rebaseModel.local, rebaseModel.base);
  const hasConflicts = mergeState.conflicts.length > 0;

  const handleApply = (changes: IResolveResult[]) => {
    const copy = cloneDeep(store.currentDetail?.dashboard);
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
  };

  const refresh = () => {
    window.location.reload();
  };
  if (noLocalChanges) {
    return (
      <Button size="xs" variant="subtle" onClick={refresh}>
        Please Refresh Page
      </Button>
    );
  }
  if (hasConflicts) {
    return <RebaseDashboardConfigModal state={mergeState} onApply={handleApply} />;
  }
  return null;
});

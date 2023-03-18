import { Divider, Notification, Text } from '@mantine/core';
import { useBoolean, useCreation, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { DashboardAPI } from '../../api-caller/dashboard';
import { useDashboardStore } from '../../frames/app/models/dashboard-store-context';
import { IDashboard } from '@devtable/dashboard';
import { diffNodes, RebaseDashboardConfigModal } from './rebase-editor';
import { cloneDeep, isEqual, pick } from 'lodash';
import { RebaseConfigModel, useRebaseModel } from './rebase-editor/rebase-config-context';
import { IResolveResult, MergeJsonDocsState } from './rebase-editor/merge-json-docs-state';
import { reaction, toJS } from 'mobx';
import { Instance } from 'mobx-state-tree';

function isConfigEqual(a: IDashboard, b: IDashboard) {
  return isEqual(pick(a, ['filters', 'definition']), pick(b, ['filters', 'definition']));
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
        mergeDocState.setBaseDocument(base);
      },
      { fireImmediately: true },
    );
  }, [rebaseModel, mergeDocState]);
  useEffect(() => {
    return reaction(
      () => toJS(rebaseModel.local),
      (local) => {
        mergeDocState.setLocalDocument(local);
      },
      { fireImmediately: true },
    );
  }, [rebaseModel, mergeDocState]);
  useEffect(() => {
    return reaction(
      () => toJS(rebaseModel.remote),
      (remote) => {
        mergeDocState.setRemoteDocument(remote);
      },
      { fireImmediately: true },
    );
  }, [rebaseModel, mergeDocState]);
  return mergeDocState;
}

export const DashboardRebaseWarning = observer(() => {
  const { store } = useDashboardStore();
  const rebaseModel = useRebaseModel();
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
    mergeState.reset();
  };
  const [show, { setFalse, set }] = useBoolean(false);

  const { data: latest, loading } = useRequest(async () => DashboardAPI.details(store.currentID), {
    refreshDeps: [store.currentID],
    pollingInterval: 6000,
  });
  useEffect(() => {
    rebaseModel.setRemote(latest?.content as IDashboard);
  }, [latest, rebaseModel]);

  useEffect(() => {
    if (loading || !store.currentDetail || store.detailsLoading) {
      return;
    }
    if (!latest?.update_time || !store.currentDetail.update_time) {
      return;
    }

    try {
      const next = new Date(latest.update_time).getTime();
      const current = new Date(store.currentDetail.update_time).getTime();
      const needsRebasing = next > current;
      set(needsRebasing);
    } catch (error) {
      console.error(error);
    }
  }, [latest, loading, store.currentDetail, store.detailsLoading]);

  if (!latest?.update_time) {
    return null;
  }

  if (!show || !hasConflicts) {
    return null;
  }

  const latestUpdatedAt = dayjs(latest.update_time).format('YYYY-MM-DD HH:mm:ss (UTC)');
  return (
    <Notification
      color="red"
      title={<Text size={16}>Version Alert</Text>}
      onClose={setFalse}
      sx={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}
    >
      <Text mt={10} color="dark">
        A newer version of this dashboard has been submitted
      </Text>
      {noLocalChanges && (
        <Text color="red" fw="bold">
          Please refresh the page before making any changes
        </Text>
      )}
      {hasConflicts && <RebaseDashboardConfigModal state={mergeState} onApply={handleApply} />}
      <Divider my={10} variant="dotted" />
      <Text size={12} ta="right">
        Latest version: {latestUpdatedAt}
      </Text>
    </Notification>
  );
});

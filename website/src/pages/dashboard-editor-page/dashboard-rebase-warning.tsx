import { Divider, Notification, Text } from '@mantine/core';
import { useBoolean, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { DashboardAPI } from '../../api-caller/dashboard';
import { useDashboardStore } from '../../frames/app/models/dashboard-store-context';
import { IDashboard } from '@devtable/dashboard';
import { RebaseDashboardConfigModal } from './rebase-editor';
import { IResolveResult } from './rebase-editor/json-merge-editor';
import { cloneDeep, isEqual, pick } from 'lodash';
import { useRebaseModel } from './rebase-editor/rebase-config-context';

function isConfigEqual(a: IDashboard, b: IDashboard) {
  return isEqual(pick(a, ['filters', 'views', 'definition']), pick(b, ['filters', 'views', 'definition']));
}
export const DashboardRebaseWarning = observer(() => {
  const { store } = useDashboardStore();
  const rebaseModel = useRebaseModel();
  const noLocalChanges = rebaseModel.local == null || isConfigEqual(rebaseModel.local, rebaseModel.base);
  const hasConflicts = !isConfigEqual(rebaseModel.local, rebaseModel.remote);
  const handleApply = (changes: IResolveResult[]) => {
    const copy = cloneDeep(store.currentDetail?.dashboard);
    if (!copy) {
      return;
    }
    for (const change of changes) {
      change.operation(copy);
    }
    rebaseModel.setRebaseResult(copy);
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
      {hasConflicts && <RebaseDashboardConfigModal onApply={handleApply} />}
      <Divider my={10} variant="dotted" />
      <Text size={12} ta="right">
        Latest version: {latestUpdatedAt}
      </Text>
    </Notification>
  );
});

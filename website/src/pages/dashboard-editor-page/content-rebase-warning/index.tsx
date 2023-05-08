import { Divider, Group, Notification, Overlay, Text } from '@mantine/core';
import { useBoolean, useRequest, useWhyDidYouUpdate } from 'ahooks';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { APICaller } from '../../../api-caller';
import { useDashboardStore } from '../../../frames/app/models/dashboard-store-context';
import { useSocketContext } from '../../../frames/socket-client-frame/socket-context';
import { RebaseActions } from './rebase-actions';
import { useRebaseModel } from './rebase-editor/rebase-config-context';

type DashboardUpdateMessageType = {
  update_time: string;
  message: 'UPDATED';
  auth_id: string | null;
  auth_type: null | 'APIKEY' | 'ACCOUNT';
};

export const ContentRebaseWarning = observer(() => {
  const { store } = useDashboardStore();
  const { socket } = useSocketContext();
  const rebaseModel = useRebaseModel();
  const [remoteKey, setRemoteKey] = useState('');
  const baseKey = store.currentDetail?.update_time;

  const id = store.currentID;
  useEffect(() => {
    socket.on(`DASHBOARD:${id}`, ({ update_time }: DashboardUpdateMessageType) => {
      console.log('🟦 DASHBOARD:UPDATE', update_time);
      setRemoteKey(update_time);
    });
  }, [socket, id]);

  const [show, { setFalse, set }] = useBoolean(false);

  const { data: latestContent, loading } = useRequest(
    async () => {
      const d = await APICaller.dashboard.details(store.currentID);
      if (!d.content_id) {
        return null;
      }
      const c = await APICaller.dashboard_content.details(d.content_id);
      return c;
    },
    {
      refreshDeps: [store.currentID, remoteKey],
    },
  );

  useEffect(() => {
    if (latestContent) {
      rebaseModel.setRemote(latestContent);
    }
  }, [latestContent, rebaseModel]);

  useEffect(() => {
    const current = store.currentDetail?.content.fullData;
    if (current) {
      rebaseModel.setLocal(current);
    }
  }, [baseKey]);

  useWhyDidYouUpdate('DashboardRebaseWarning', { store, socket, rebaseModel, remoteKey, baseKey, id });
  useEffect(() => {
    if (!remoteKey || !baseKey) {
      setFalse();
      return;
    }

    try {
      if (rebaseModel.resolvedRemotes.has(remoteKey) === true) {
        setFalse();
        return;
      }
      const next = new Date(remoteKey).getTime();
      const current = new Date(baseKey).getTime();
      const needsRebasing = next > current;
      set(needsRebasing);
    } catch (error) {
      console.error(error);
    }
  }, [rebaseModel, baseKey, remoteKey]);

  if (!remoteKey || loading) {
    return null;
  }

  if (!show) {
    return null;
  }

  const latestUpdatedAt = dayjs(remoteKey).format('YYYY-MM-DD HH:mm:ss (UTC)');
  return (
    <>
      <Overlay zIndex={310} color="black" opacity={0.4} blur={2} />
      <Notification
        color="red"
        title={
          <Group>
            <Text size={16}>Version Alert</Text>
            <Text size={12} color="dimmed">
              Remote version: {latestUpdatedAt}
            </Text>
          </Group>
        }
        disallowClose
        sx={{ position: 'fixed', top: 10, right: 15, zIndex: 410 }}
      >
        <Text mt={10} color="dark">
          A newer version of this dashboard has been submitted.
        </Text>
        <Divider mt={20} mb={10} variant="dotted" />
        <Group position="right">
          <RebaseActions rebaseModel={rebaseModel} remoteKey={remoteKey} onFinish={setFalse} />
        </Group>
      </Notification>
    </>
  );
});

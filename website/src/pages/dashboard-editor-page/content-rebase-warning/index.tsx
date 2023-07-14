import { Divider, Group, Notification, Overlay, Text } from '@mantine/core';
import { useBoolean, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { APICaller } from '../../../api-caller';
import { useDashboardStore } from '../../../frames/app/models/dashboard-store-context';
import { useSocketContext } from '../../../frames/socket-client-frame/socket-context';
import { RebaseActions } from './rebase-actions';
import { useRebaseModel } from './rebase-editor/rebase-config-context';

type DashboardContentUpdateMessageType = {
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
  const baseKey = store.currentDetail?.content.fullData?.update_time || 'initial_version';

  const id = store.currentContentID;
  useEffect(() => {
    socket.on(`DASHBOARD_CONTENT:${id}`, ({ update_time }: DashboardContentUpdateMessageType) => {
      console.log('🟦 DASHBOARD_CONTENT:UPDATE', update_time);
      setRemoteKey(update_time);
    });
  }, [socket, id]);

  const [show, { setFalse, set }] = useBoolean(false);

  const { data: latestContent, loading } = useRequest(
    async () => {
      if (!id) {
        return null;
      }
      return APICaller.dashboard_content.details(id);
    },
    {
      refreshDeps: [id, remoteKey],
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
        withCloseButton={false}
        sx={{ position: 'fixed', top: 10, right: 15, zIndex: 410 }}
      >
        <Text mt={10} color="dark">
          Someone made changes to this version.
        </Text>
        <Divider mt={20} mb={10} variant="dotted" />
        <Group position="right">
          <RebaseActions rebaseModel={rebaseModel} remoteKey={remoteKey} onFinish={setFalse} />
        </Group>
      </Notification>
    </>
  );
});

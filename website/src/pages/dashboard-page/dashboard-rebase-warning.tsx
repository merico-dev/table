import { Divider, Notification, Text } from '@mantine/core';
import { useBoolean, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { DashboardAPI } from '../../api-caller/dashboard';
import { DashboardDetailModelInstance } from '../../frames/app/models/dashboard-detail-model';

interface IDashboardRebaseWarning {
  id: string;
  current: DashboardDetailModelInstance;
}
export function DashboardRebaseWarning({ id, current }: IDashboardRebaseWarning) {
  const [show, { setFalse, set }] = useBoolean(false);

  const { data: latest = { update_time: 0 }, loading } = useRequest(async () => DashboardAPI.details(id), {
    refreshDeps: [id],
    pollingInterval: 60000,
  });

  useEffect(() => {
    if (loading) {
      return;
    }

    const needsRebasing = latest?.update_time !== current.update_time;
    set(needsRebasing);
  }, [latest, current]);

  if (loading) {
    return null;
  }
  if (!latest) {
    return null;
  }

  if (!show) {
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
      <Text color="red" fw="bold">
        Please refresh the page before making any changes
      </Text>
      <Divider my={10} variant="dotted" />
      <Text size={12} ta="right">
        Latest version: {latestUpdatedAt}
      </Text>
    </Notification>
  );
}

import { Notification, Text } from '@mantine/core';
import { IconExclamationMark } from '@tabler/icons';
import { useBoolean, useRequest } from 'ahooks';
import { useEffect } from 'react';
import { DashboardAPI } from '../../api-caller/dashboard';
import { DashboardDetailModelInstance } from '../../frames/app/models/dashboard-store';

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

  return (
    <Notification
      icon={<IconExclamationMark size={18} />}
      color="red"
      title="Version Alert"
      onClose={setFalse}
      sx={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}
    >
      <Text color="dark">A newer version of this dashboard has been submitted</Text>
      <Text>Please refresh the page before making any changes</Text>
    </Notification>
  );
}

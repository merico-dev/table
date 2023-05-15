import { Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ContentVersionManager } from './content-version-manager';
import { DashboardHistoryModal } from './dashboard-history-modal';
import { DashboardPermissionModal } from './dashboard-permission-modal';
import { WhosEditing } from './whos-editing';

export const MoreDashboardInfo = observer(() => {
  return (
    <Group sx={{ flexGrow: 1 }} position="right">
      <ContentVersionManager />
      <WhosEditing />
      <DashboardHistoryModal />
      <DashboardPermissionModal />
    </Group>
  );
});

import { Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { WhosEditing } from './whos-editing';
import { DashboardHistoryModal } from './dashboard-history-modal';

export const MoreDashboardInfo = observer(() => {
  return (
    <Group sx={{ flexGrow: 1 }} position="right">
      <WhosEditing />
      <DashboardHistoryModal />
    </Group>
  );
});

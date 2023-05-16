import { Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ContentVersionManager } from './content-version-manager';
import { DashboardChangelogModal } from './dashboard-changlog-modal';
import { DashboardPermissionModal } from './dashboard-permission-modal';
import { WhosEditing } from './whos-editing';
import { useModalState } from './use-modal-state';
import { DashboardChangelogModalTrigger } from './dashboard-changlog-modal/changelog-modal-trigger';

export const MoreDashboardInfo = observer(() => {
  const changelogState = useModalState();
  return (
    <Group sx={{ flexGrow: 1 }} position="apart">
      <ContentVersionManager />
      <Group sx={{ flexGrow: 1 }} position="right">
        <WhosEditing />
        <DashboardPermissionModal />
        <DashboardChangelogModal state={changelogState} />
        <DashboardChangelogModalTrigger state={changelogState} />
      </Group>
    </Group>
  );
});

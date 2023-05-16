import { Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ContentVersionManager } from './content-version-manager';
import { DashboardChangelogModal } from './dashboard-changlog-modal';
import { DashboardPermissionModal } from './dashboard-permission-modal';
import { TModalStates } from './types';
import { WhosEditing } from './whos-editing';

interface IProps {
  states: TModalStates;
}

export const MoreDashboardInfo = observer(({ states }: IProps) => {
  return (
    <Group sx={{ flexGrow: 1 }} position="apart">
      <ContentVersionManager />
      <Group sx={{ flexGrow: 1 }} position="right">
        <WhosEditing />
        <DashboardPermissionModal />
        <DashboardChangelogModal state={states.changelog} />
      </Group>
    </Group>
  );
});

import { Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ContentVersionManager } from './content-version-manager';
import { DashboardPermissionModal } from './dashboard-permission-modal';
import { WhosEditing } from './whos-editing';
import { LanguageSwitcher } from '../../../components/language-switcher';

export const MoreDashboardInfo = observer(() => {
  return (
    <Group sx={{ flexGrow: 1 }} justify="space-between">
      <ContentVersionManager />
      <Group sx={{ flexGrow: 1 }} justify="flex-end">
        <WhosEditing />
        <DashboardPermissionModal />
        <LanguageSwitcher />
      </Group>
    </Group>
  );
});

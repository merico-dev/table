import { Group, Header as MantineHeader, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { AccountDropdown } from '../../../components/account-dropdown';
import { MericoLogo } from '../../../resources/merico-logo';
import { useAccountContext } from '../../require-auth/account-context';
import { useDashboardStore } from '../models/dashboard-store';
import { DeleteDashboard } from './delete-dashboard';

const _Header = () => {
  const { canEdit } = useAccountContext();
  const { store } = useDashboardStore();
  return (
    <MantineHeader height={60} px="md" py={0}>
      <Group position="apart" sx={{ height: 60 }}>
        <Group>
          <MericoLogo width={40} />
          <Text size="xl">@devtable</Text>
        </Group>
        <Group position="right">
          {canEdit && store.currentBoard?.isEditable && <DeleteDashboard />}
          <AccountDropdown />
        </Group>
      </Group>
    </MantineHeader>
  );
};
export const Header = observer(_Header);

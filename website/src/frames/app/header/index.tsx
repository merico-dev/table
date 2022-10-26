import { Group, Header as MantineHeader, Text } from '@mantine/core';
import { AccountDropdown } from '../../../components/account-dropdown';
import { MericoLogo } from '../../../resources/merico-logo';
import { useAccountContext } from '../../require-auth/account-context';
import { DeleteDashboard } from './delete-dashboard';

export function Header() {
  const { canEdit } = useAccountContext();
  return (
    <MantineHeader height={60} px="md" py={0}>
      <Group position="apart" sx={{ height: 60 }}>
        <Group>
          <MericoLogo width={40} />
          <Text size="xl">@devtable</Text>
        </Group>
        <Group position="right">
          {canEdit && <DeleteDashboard />}
          <AccountDropdown />
        </Group>
      </Group>
    </MantineHeader>
  );
}

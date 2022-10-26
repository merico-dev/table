import { Group, Header as MantineHeader, Text } from '@mantine/core';
import { MericoLogo } from '../../../resources/merico-logo';
import { useAccountContext } from '../../require-auth/account-context';
import { DeleteDashboard } from './delete-dashboard';

export function Header() {
  const { canEdit } = useAccountContext();
  return (
    <MantineHeader height={60} p="md">
      <Group position="apart">
        <Group>
          <MericoLogo width={40} />
          <Text size="xl">@devtable</Text>
        </Group>
        <Group position="right">{canEdit && <DeleteDashboard />}</Group>
      </Group>
    </MantineHeader>
  );
}

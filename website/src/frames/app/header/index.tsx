import { Group, Header as MantineHeader, Text } from '@mantine/core';
import { MericoLogo } from '../../../resources/merico-logo';
import { DeleteDashboard } from './delete-dashboard';

export function Header() {
  return (
    <MantineHeader height={60} p="md">
      <Group position="apart">
        <Group>
          <MericoLogo width={40} />
          <Text size="xl">@devtable</Text>
        </Group>
        <Group position="right">
          <DeleteDashboard />
        </Group>
      </Group>
    </MantineHeader>
  );
}

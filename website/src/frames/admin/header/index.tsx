import { Group, Header as MantineHeader } from '@mantine/core';
import { AccountDropdown } from '../../../components/account-dropdown';
import { Logo } from '../../../components/logo';

export function AdminHeader() {
  return (
    <MantineHeader height={60} px="md" py={0}>
      <Group position="apart" sx={{ height: 60 }}>
        <Group position="left">
          <Logo />
        </Group>
        <Group position="right">
          <AccountDropdown height={60} />
        </Group>
      </Group>
    </MantineHeader>
  );
}

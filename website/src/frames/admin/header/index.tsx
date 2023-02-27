import { Group, Header as MantineHeader } from '@mantine/core';
import { AccountDropdown } from '../../../components/account-dropdown';
import { LogoLink } from '../../../components/logo-link';

export function AdminHeader() {
  return (
    <MantineHeader height={60} px="md" py={0}>
      <Group position="apart" sx={{ height: 60 }}>
        <LogoLink />
        <Group position="right">
          <AccountDropdown />
        </Group>
      </Group>
    </MantineHeader>
  );
}

import { Group, Header as MantineHeader, Text } from '@mantine/core';
import React from 'react';
import { AccountDropdown } from '../../../components/account-dropdown';
import { MericoLogo } from '../../../resources/merico-logo';

export function AdminHeader() {
  return (
    <MantineHeader height={60} px="md" py={0}>
      <Group position="apart" sx={{ height: 60 }}>
        <Group>
          <MericoLogo width={40} />
          <Text size="xl">@devtable</Text>
        </Group>
        <Group position="right">
          <AccountDropdown />
        </Group>
      </Group>
    </MantineHeader>
  );
}

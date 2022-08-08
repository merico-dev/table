import { Group, Header as MantineHeader, Text } from '@mantine/core';
import React from 'react';
import { MericoLogo } from '../../../resources/merico-logo';

interface IAdminHeader {}

export function AdminHeader({}: IAdminHeader) {
  return (
    <MantineHeader height={60} p="md">
      <Group position="apart">
        <Group>
          <MericoLogo width={40} />
          <Text size="xl">@devtable</Text>
        </Group>
      </Group>
    </MantineHeader>
  );
}

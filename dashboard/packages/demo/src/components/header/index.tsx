import { Group, Header as MantineHeader, Text } from '@mantine/core'
import React from 'react';
import { CreateDashboard } from './create-dashboard';
import { DashboardSelector } from './dashboard-selector';
import { MericoLogo } from './merico-logo';

interface IHeader {
}

export function Header({ }: IHeader) {
  return (
    <MantineHeader height={60} p="md">
      <Group position='apart'>
        <Group>
          <MericoLogo width={40} />
          <Text size="xl" >Dashboard</Text>
        </Group>
        <Group position='right'>
          <DashboardSelector />
          <CreateDashboard />
        </Group>
      </Group>
    </MantineHeader>
  )
}
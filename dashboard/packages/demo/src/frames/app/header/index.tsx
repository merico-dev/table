import { Anchor, Group, Header as MantineHeader, Text } from '@mantine/core'
import React from 'react';
import { CreateDashboard } from '../navbar/create-dashboard';
import { DeleteDashboard } from './delete-dashboard';
import { DashboardSelector } from './dashboard-selector';
import { MericoLogo } from '../../../resources/merico-logo';
import { Settings } from 'tabler-icons-react';
import { Link } from 'react-router-dom';

interface IHeader {
}

export function Header({ }: IHeader) {
  return (
    <MantineHeader height={60} p="md">
      <Group position='apart'>
        <Group>
          <MericoLogo width={40} />
          <Text size="xl">@devtable</Text>
        </Group>
        <Group position='right'>
          <DeleteDashboard />
        </Group>
      </Group>
    </MantineHeader>
  )
}
import { Group, Header as MantineHeader, Text } from '@mantine/core'
import React from 'react';
import { DashboardSelector } from './dashboard-selector';
import { MericoLogo } from './merico-logo';

interface IHeader {
  id: string;
  setID: React.Dispatch<React.SetStateAction<string>>;
}

export function Header({ id, setID }: IHeader) {
  return (
    <MantineHeader height={60} p="md">
      <Group position='apart'>
        <Group>
          <MericoLogo width={40} />
          <Text size="xl" >Dashboard</Text>
        </Group>
        <Group>
          <DashboardSelector id={id} setID={setID} />
        </Group>
      </Group>
    </MantineHeader>
  )
}
import { Button, Group, Header as MantineHeader, Text } from '@mantine/core'
import React from 'react';
import { MericoLogo } from '../../../resources/merico-logo';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'tabler-icons-react';

interface IAdminHeader {
}

export function AdminHeader({ }: IAdminHeader) {
  const navigate = useNavigate();
  const gotoDashboard = () => navigate('/dashboard');

  return (
    <MantineHeader height={60} p="md">
      <Group position='apart'>
        <Group>
          <MericoLogo width={40} />
          <Text size="xl" >Settings</Text>
        </Group>
        <Group position='right'>
          <Button variant="default" size="xs" onClick={gotoDashboard} leftIcon={<ArrowLeft size={20} />}>Back to Dashboard</Button>
        </Group>
      </Group>
    </MantineHeader>
  )
}
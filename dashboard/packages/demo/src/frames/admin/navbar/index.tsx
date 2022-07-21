import React from 'react';
import { Button, Group, Navbar as MantineNavbar, Text } from '@mantine/core'
import { ArrowLeft } from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { AdminPageLinks } from './admin-page-links';

interface IAdminNavbar {
}

export function AdminNavbar({ }: IAdminNavbar) {
  const navigate = useNavigate();
  const gotoDashboard = () => navigate('/dashboard');
  return (
    <MantineNavbar p="md" width={{ base: 300 }}>
      <MantineNavbar.Section>
        <Group grow pb="md" sx={{ borderBottom: '1px solid #eee', '> button': { flexGrow: 1 } }}>
          <Text align='center'>Settings</Text>
        </Group>
      </MantineNavbar.Section>

      <MantineNavbar.Section grow>
        <AdminPageLinks />
      </MantineNavbar.Section>

      <MantineNavbar.Section>
        <Group grow pt="sm" sx={{ borderTop: '1px solid #eee' }}>
          <Button size="sm" onClick={gotoDashboard} leftIcon={<ArrowLeft size={20} />}>Back to Dashboard</Button>
        </Group>
      </MantineNavbar.Section>
    </MantineNavbar>
  )
}
import React from 'react';
import { Box, Button, Group, Navbar as MantineNavbar, Text } from '@mantine/core';
import { Settings } from 'tabler-icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateDashboard } from './create-dashboard';
import { DashboardLinks } from './dashboard-links';

interface INavbar {}

export function Navbar({}: INavbar) {
  const { id } = useParams();
  const navigate = useNavigate();
  const gotoSettings = () => {
    if (id) {
      localStorage.setItem('last_visited_dashboard_id', id);
    }
    navigate('/admin/data_source/list');
  };

  return (
    <MantineNavbar p="md" width={{ base: 300 }}>
      <MantineNavbar.Section>
        <Group grow pb="sm" sx={{ borderBottom: '1px solid #eee', '> button': { flexGrow: 1 } }}>
          <CreateDashboard />
        </Group>
      </MantineNavbar.Section>

      <MantineNavbar.Section grow>
        <DashboardLinks />
      </MantineNavbar.Section>

      <MantineNavbar.Section>
        <Group grow pt="sm" sx={{ borderTop: '1px solid #eee' }}>
          <Button size="sm" onClick={gotoSettings} leftIcon={<Settings size={20} />}>
            Settings
          </Button>
        </Group>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
}

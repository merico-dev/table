import { Box, Button, Group, Navbar as MantineNavbar } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { Settings } from 'tabler-icons-react';
import { useAccountContext } from '../../require-auth/account-context';
import { CreateDashboard } from './create-dashboard';
import { DashboardLinks } from './dashboard-links';

export function Navbar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const gotoSettings = () => {
    if (id) {
      localStorage.setItem('last_visited_dashboard_id', id);
    }
    navigate('/admin/data_source/list');
  };

  const { canEdit } = useAccountContext();

  return (
    <MantineNavbar p="md" width={{ base: 300, height: '100vh - 60px - 60px' }}>
      {canEdit && (
        <MantineNavbar.Section>
          <Group grow pb="sm" sx={{ borderBottom: '1px solid #eee', '> button': { flexGrow: 1 } }}>
            <CreateDashboard />
          </Group>
        </MantineNavbar.Section>
      )}

      <MantineNavbar.Section grow sx={{ overflow: 'hidden' }}>
        <Box sx={{ height: '100%', overflow: 'scroll' }}>
          <DashboardLinks />
        </Box>
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

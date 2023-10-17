import { ActionIcon, Box, Button, Group, Navbar as MantineNavbar, Text, Tooltip } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { List, Settings } from 'tabler-icons-react';
import { useAccountContext } from '../../require-auth/account-context';
import { CreateDashboard } from './create-dashboard';
import { DashboardLinks } from './dashboard-links';
import { ImportDashboard } from './import-dashboard';
import { Logo } from '../../../components/logo';
import { IconLayoutSidebar } from '@tabler/icons-react';

export function Navbar({ collapsed, collapse }: { collapsed: boolean; collapse: () => void }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const gotoSettings = () => {
    if (id) {
      localStorage.setItem('last_visited_dashboard_id', id);
    }
    navigate('/admin/data_source/list');
  };

  const { canEdit, isAdmin } = useAccountContext();

  return (
    <MantineNavbar width={{ base: 300 }} height="100vh" sx={{ overflow: 'hidden' }}>
      <MantineNavbar.Section>
        <Group position="apart" py={5} px={10} h={40}>
          <Box sx={{ height: '30px' }}>
            <Logo />
          </Box>
          <Tooltip label="Hide sidebar">
            <ActionIcon size="xs" onClick={collapse}>
              <IconLayoutSidebar />
            </ActionIcon>
          </Tooltip>
        </Group>
      </MantineNavbar.Section>
      <MantineNavbar.Section pt="xs">
        <Group px="xs" grow pb="sm" sx={{ borderBottom: '1px solid #eee', '> button': { flexGrow: 1 } }}>
          {canEdit && (
            <>
              <CreateDashboard />
              <ImportDashboard />
            </>
          )}
          {!canEdit && (
            <Group pl={12}>
              <List size={16} />
              <Text sx={{ cursor: 'default' }}>Dashboards</Text>
            </Group>
          )}
        </Group>
      </MantineNavbar.Section>

      <MantineNavbar.Section grow sx={{ overflow: 'hidden' }} pl="xs" pr={0}>
        <Box sx={{ height: '100%', overflow: 'auto' }}>
          <DashboardLinks />
        </Box>
      </MantineNavbar.Section>

      {isAdmin && (
        <MantineNavbar.Section pb="xs">
          <Group grow pt="sm" px="xs" sx={{ borderTop: '1px solid #eee' }}>
            <Button size="sm" onClick={gotoSettings} leftIcon={<Settings size={20} />}>
              System Settings
            </Button>
          </Group>
        </MantineNavbar.Section>
      )}
    </MantineNavbar>
  );
}

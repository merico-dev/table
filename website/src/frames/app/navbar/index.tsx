import { ActionIcon, Box, Group, Navbar as MantineNavbar, Text, Tooltip } from '@mantine/core';
import { IconLayoutSidebar, IconList, IconSettings } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Logo } from '../../../components/logo';
import { useAccountContext } from '../../require-auth/account-context';
import { CreateDashboard } from './create-dashboard';
import { DashboardLinks } from './dashboard-links';
import { ImportDashboard } from './import-dashboard';

export function Navbar({ collapse }: { collapse: () => void }) {
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
          <Logo height="24px" />
          <Group position="right">
            {isAdmin && (
              <Tooltip label="System Settings">
                <ActionIcon size="xs" onClick={gotoSettings}>
                  <IconSettings size={20} />
                </ActionIcon>
              </Tooltip>
            )}

            <Tooltip label="Hide sidebar">
              <ActionIcon size="xs" onClick={collapse}>
                <IconLayoutSidebar />
              </ActionIcon>
            </Tooltip>
          </Group>
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
              <IconList size={16} />
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
    </MantineNavbar>
  );
}

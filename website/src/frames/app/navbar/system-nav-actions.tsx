import { ActionIcon, Group, Tooltip, AppShell } from '@mantine/core';
import { IconLayoutSidebar, IconSettings } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Logo } from '../../../components/logo';
import { useAccountContext } from '../../require-auth/account-context';

export const SystemNavActions = ({ collapse }: { collapse: () => void }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const gotoSettings = () => {
    if (id) {
      localStorage.setItem('last_visited_dashboard_id', id);
    }
    navigate('/admin/data_source/list');
  };
  const { isAdmin } = useAccountContext();
  return (
    <AppShell.Section>
      <Group justify="apart" py={5} px={10} h={40} sx={{ borderBottom: '1px solid #eee' }}>
        <Logo height="24px" />
        <Group justify="flex-end">
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
    </AppShell.Section>
  );
};

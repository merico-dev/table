import { ActionIcon, Group, Navbar as MantineNavbar, Tooltip } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../../components/logo';

export const AdminSystemNavActions = () => {
  const navigate = useNavigate();
  const gotoDashboard = () => {
    const id = localStorage.getItem('last_visited_dashboard_id');
    const path = id ? `/dashboard/${id}` : '/dashboard';
    navigate(path);
  };
  return (
    <MantineNavbar.Section>
      <Group position="apart" py={5} px={10} h={40} sx={{ borderBottom: '1px solid #eee' }}>
        <Logo height="24px" />
        <Group position="right">
          <Tooltip label="Back to dashboards">
            <ActionIcon color="blue" size="xs" onClick={gotoDashboard}>
              <IconX size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </MantineNavbar.Section>
  );
};

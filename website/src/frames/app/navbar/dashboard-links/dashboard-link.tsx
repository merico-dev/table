import { Box, Group, Text, UnstyledButton } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { ActionMenu } from './action-menu';

interface DashboardLinkProps {
  id: string;
  name: string;
  active: boolean;
  preset?: boolean;
  openOverwriteModal: (id: string) => void;
  openEditModal: (id: string) => void;
}

export function DashboardLink({ id, name, active, preset, openOverwriteModal, openEditModal }: DashboardLinkProps) {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/dashboard/${id}`);
  return (
    <Box sx={{ position: 'relative' }}>
      <UnstyledButton
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          paddingRight: '42px',
          borderRadius: 0,
          position: 'relative',
          color: theme.black,
          flexGrow: 1,

          '&:hover': {
            backgroundColor: theme.colors.gray[0],
          },

          backgroundColor: active ? theme.colors.gray[2] : 'transparent',
        })}
      >
        <Group onClick={handleClick}>
          <Text size="sm">{name}</Text>
        </Group>
      </UnstyledButton>
      <ActionMenu id={id} preset={preset} openOverwriteModal={openOverwriteModal} openEditModal={openEditModal} />
    </Box>
  );
}

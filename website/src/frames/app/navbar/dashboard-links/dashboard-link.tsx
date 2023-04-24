import { Box, Group, Text, UnstyledButton } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { ActionMenu } from './action-menu';
import { DashboardBriefModelInstance } from '../../models/dashboard-brief-model';
import { observer } from 'mobx-react-lite';

interface DashboardLinkProps {
  active: boolean;
  openOverwriteModal: (id: string) => void;
  openEditModal: (id: string) => void;
  model: DashboardBriefModelInstance;
}

export const DashboardLink = observer(({ model, active, openOverwriteModal, openEditModal }: DashboardLinkProps) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/dashboard/${model.id}`);
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
          <Text size="sm">{model.name}</Text>
        </Group>
      </UnstyledButton>
      <ActionMenu
        model={model}
        preset={model.is_preset}
        openOverwriteModal={openOverwriteModal}
        openEditModal={openEditModal}
      />
    </Box>
  );
});

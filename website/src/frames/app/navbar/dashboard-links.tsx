import { Group, UnstyledButton, Text, LoadingOverlay, Box } from '@mantine/core';
import { useRequest } from 'ahooks';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardAPI } from '../../../api-caller/dashboard';

interface DashboardLinkProps {
  id: string;
  name: string;
  active: boolean;
}

function DashboardLink({ id, name, active }: DashboardLinkProps) {
  const navigate = useNavigate();
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.black,

        '&:hover': {
          backgroundColor: theme.colors.gray[0],
        },

        backgroundColor: active ? theme.colors.gray[2] : 'transparent',
      })}
      onClick={() => navigate(`/dashboard/${id}`)}
    >
      <Group>
        <Text size="sm">{name}</Text>
      </Group>
    </UnstyledButton>
  );
}

export function DashboardLinks() {
  const { id } = useParams();
  const { data = [], loading } = useRequest(
    async () => {
      const { data } = await DashboardAPI.list();
      return data;
    },
    {
      refreshDeps: [id],
    },
  );

  return (
    <Box pt="sm" sx={{ position: 'relative', minHeight: '60px' }}>
      <LoadingOverlay visible={loading} />
      {data.map((d) => (
        <DashboardLink key={d.id} active={id === d.id} {...d} />
      ))}
    </Box>
  );
}

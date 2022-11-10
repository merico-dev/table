import { Box, Group, LoadingOverlay, Text, Tooltip, UnstyledButton, useMantineTheme } from '@mantine/core';
import { IconLock } from '@tabler/icons';
import { useRequest } from 'ahooks';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardAPI } from '../../../api-caller/dashboard';

interface DashboardLinkProps {
  id: string;
  name: string;
  active: boolean;
  preset?: boolean;
}

function DashboardLink({ id, name, active, preset }: DashboardLinkProps) {
  const navigate = useNavigate();
  const theme = useMantineTheme();
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
      <Group position="apart">
        <Text size="sm">{name}</Text>
        {preset && (
          <Tooltip
            position="right"
            withinPortal
            withArrow
            label="This is a preset dashboard. You can not edit it."
            events={{ hover: true, focus: false, touch: false }}
          >
            <span>
              <IconLock size="16px" color={theme.colors.gray[7]} />
            </span>
          </Tooltip>
        )}
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
        <DashboardLink preset={d.is_preset} key={d.id} active={id === d.id} {...d} />
      ))}
    </Box>
  );
}

import { Group, Text, Tooltip, UnstyledButton, useMantineTheme } from '@mantine/core';
import { IconLock } from '@tabler/icons';
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
  const theme = useMantineTheme();
  return (
    <UnstyledButton
      pl="xs"
      py={0}
      pr={0}
      sx={(theme) => ({
        position: 'relative',
        display: 'block',
        width: '100%',
        height: '42px',
        borderRadius: theme.radius.sm,
        color: theme.black,

        '&:hover': {
          backgroundColor: theme.colors.gray[0],
        },

        backgroundColor: active ? theme.colors.gray[2] : 'transparent',
      })}
    >
      <Group position="apart" noWrap>
        <Text
          size="sm"
          py="xs"
          pr="xs"
          // @ts-expect-error !important
          sx={{ flexGrow: '1 !important', height: '42px' }}
          onClick={() => navigate(`/dashboard/${id}`)}
        >
          {name}
        </Text>
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
        {!preset && active && (
          <ActionMenu id={id} preset={false} openOverwriteModal={openOverwriteModal} openEditModal={openEditModal} />
        )}
      </Group>
    </UnstyledButton>
  );
}

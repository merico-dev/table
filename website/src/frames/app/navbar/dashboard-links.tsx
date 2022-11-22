import { Box, Group, LoadingOverlay, Text, Tooltip, UnstyledButton, useMantineTheme } from '@mantine/core';
import { IconLock } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../models/dashboard-store';
import { ActionMenu } from './action-menu';

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
        {!preset && active && <ActionMenu id={id} />}
      </Group>
    </UnstyledButton>
  );
}

function _DashboardLinks() {
  const { store } = useDashboardStore();

  return (
    <Box pt="sm" sx={{ position: 'relative', minHeight: '60px' }}>
      <LoadingOverlay visible={store.loading} />
      {store.boardList.map((d) => (
        <DashboardLink preset={d.is_preset} key={d.id} active={store.currentBoard?.id === d.id} {...d} />
      ))}
    </Box>
  );
}

export const DashboardLinks = observer(_DashboardLinks);

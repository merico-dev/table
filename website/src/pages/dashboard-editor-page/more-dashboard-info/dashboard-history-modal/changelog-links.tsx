import { Box, Group, Text, UnstyledButton } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { DashboardChangelogDBType } from '../../../../api-caller/dashboard-changelog.types';

interface IChangelogNavLink {
  onClick: () => void;
  name: string;
  active: boolean;
}

function ChangelogNavLink({ onClick, name, active }: IChangelogNavLink) {
  return (
    <Box sx={{ position: 'relative' }}>
      <UnstyledButton
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: 0,
          position: 'relative',
          color: theme.black,

          '&:hover': {
            backgroundColor: theme.colors.gray[0],
          },

          backgroundColor: active ? theme.colors.gray[2] : 'transparent',
        })}
      >
        <Group position="center" onClick={onClick}>
          <Text size="sm" sx={{ fontFamily: 'monospace' }}>
            {name}
          </Text>
        </Group>
      </UnstyledButton>
    </Box>
  );
}

interface IChangelogNavLinks {
  data: DashboardChangelogDBType[];
  currentChangelogID?: string;
  onClick: (id: string) => void;
}

export const ChangelogNavLinks = observer(({ data, currentChangelogID, onClick }: IChangelogNavLinks) => {
  const getClickHandler = useCallback((id: string) => () => onClick(id), [onClick]);
  return (
    <Box sx={{ position: 'relative' }}>
      {data.map((v) => (
        <ChangelogNavLink
          key={v.id}
          active={currentChangelogID === v.id}
          name={v.create_time}
          onClick={getClickHandler(v.id)}
        />
      ))}
    </Box>
  );
});

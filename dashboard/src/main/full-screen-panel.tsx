import { Button, Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ArrowLeft } from 'tabler-icons-react';
import { DashboardModelInstance } from '../model';
import { Panel } from '../panel';
import { IDashboardPanel } from '../types';

export const FullScreenPanel = observer(function _FullScreenPanel({
  panel,
  exitFullScreen,
  model,
}: {
  panel: IDashboardPanel;
  exitFullScreen: () => void;
  model: DashboardModelInstance;
}) {
  return (
    <Stack sx={{ flexGrow: 1, justifyContent: 'flex-start' }}>
      <Group sx={{ flexGrow: 0 }}>
        <Button variant="default" size="sm" onClick={exitFullScreen} leftIcon={<ArrowLeft size={20} />}>
          Exit fullscreen
        </Button>
      </Group>
      <Group grow sx={{ flexGrow: 1, flexShrink: 0 }}>
        <Panel {...panel} model={model} />
      </Group>
    </Stack>
  );
});

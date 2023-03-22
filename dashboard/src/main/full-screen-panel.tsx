import { Button, Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ArrowLeft } from 'tabler-icons-react';
import { PanelModelInstance } from '~/model/panels';
import { ViewModelInstance } from '..';
import { Panel } from '../panel';

export const FullScreenPanel = observer(function _FullScreenPanel({
  view,
  panel,
  exitFullScreen,
}: {
  view: ViewModelInstance;
  panel: PanelModelInstance;
  exitFullScreen: () => void;
}) {
  return (
    <Stack px="10px" pb="5px" sx={{ height: '100%', flexGrow: 1, justifyContent: 'flex-start' }}>
      <Group sx={{ flexGrow: 0 }}>
        <Button variant="default" size="sm" onClick={exitFullScreen} leftIcon={<ArrowLeft size={20} />}>
          Exit fullscreen
        </Button>
      </Group>
      <Group grow sx={{ flexGrow: 1, flexShrink: 0 }}>
        <Panel view={view} panel={panel} />
      </Group>
    </Stack>
  );
});
